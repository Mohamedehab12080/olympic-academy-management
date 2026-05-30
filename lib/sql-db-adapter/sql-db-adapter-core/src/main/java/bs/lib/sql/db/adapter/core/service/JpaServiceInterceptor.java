package bs.lib.sql.db.adapter.core.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityManagerFactory;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;
import org.hibernate.CallbackException;
import org.hibernate.Interceptor;
import org.hibernate.type.Type;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Component;
import bs.lib.common.model.exception.BusinessException;

import bs.lib.sql.db.adapter.model.config.AbstractSQLDBAdapterConfig;
import bs.lib.sql.db.adapter.model.config.DBColumnConfig;
import bs.lib.sql.db.adapter.model.config.EvaluatedEntityConfig;
import bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterErrors;
import bs.lib.sql.db.adapter.model.enums.SQLDatabaseEvents;

import java.util.*;

import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseEvents.BEFORE_INSERT;
import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseEvents.BEFORE_UPDATE;


@Component
@RequiredArgsConstructor
public class JpaServiceInterceptor implements Interceptor {
    private final AbstractSQLDBAdapterConfig sqlDBConfig;
    private final ObjectProvider<EntityManagerFactory> entityManagerFactoryProvider;

    public EntityManager getEntityManager() {
        EntityManagerFactory emf = entityManagerFactoryProvider.getIfAvailable();
        return Objects.requireNonNull(emf).createEntityManager();
    }

    @Override
    public boolean onPersist(Object entity, Object id, Object[] fieldValues,
                             String[] fieldNames, Type[] types) throws CallbackException {

        String entityName = entity.getClass().getSimpleName();
        EvaluatedEntityConfig entityConfig = sqlDBConfig.getEvaluatedEntities().get(entityName);

        if (entityConfig == null) {
            return false;
        }

        List<AttributeValue> uniqueAttributes = new ArrayList<>();
        for (int i = 0; i < fieldNames.length; i++) {
            String fieldName = fieldNames[i];
            if (entityConfig.getUniqueAttributes().contains(fieldName) && fieldValues[i] != null) {
                DBColumnConfig columnConfig = sqlDBConfig.getEntities().get(entityName).getAttributes()
                        .get(fieldName);
                uniqueAttributes.add(new AttributeValue(fieldName, columnConfig.getTitleEn(),
                        columnConfig.getTitleAr(), fieldValues[i]));
            }
        }

        if (uniqueAttributes.isEmpty()) {
            return false;
        }

        validateUniqueConstraintsOptimized(BEFORE_INSERT, entityName, uniqueAttributes, null);

        return false;
    }

    @Override
    public boolean onFlushDirty(Object entity, Object id, Object[] newValues,
                                Object[] oldValues, String[] fieldNames,
                                Type[] types) throws CallbackException {
        if (oldValues == null) {
            return false;
        }
        String entityName = entity.getClass().getSimpleName();
        EvaluatedEntityConfig rules = sqlDBConfig.getEvaluatedEntities().get(entityName);

        if (rules == null) {
            return false;
        }

        if (rules.getNonUpdateAttributes() != null && !rules.getNonUpdateAttributes().isEmpty()) {
            for (int i = 0; i < fieldNames.length; i++) {
                String fieldName = fieldNames[i];
                if (rules.getNonUpdateAttributes().contains(fieldName)) {
                    Object newValue = newValues[i];
                    Object oldValue = oldValues[i];
                    if (!Objects.equals(newValue, oldValue)) {
                        if (oldValue != null) {
                            // Get the column config to access titleEn
                            DBColumnConfig columnConfig = sqlDBConfig.getEntities().get(entityName).getAttributes()
                                    .get(fieldName);

                            String fieldDisplayName = (columnConfig.getTitleEn() != null && !columnConfig.getTitleEn().trim().isEmpty())
                                    ? columnConfig.getTitleEn()
                                    : fieldName;

                            throw new BusinessException(
                                    SQLDatabaseAdapterErrors.FIELD_NOT_UPDATABLE,
                                    entityName,
                                    fieldDisplayName
                            );
                        }
                    }
                }
            }
        }

        if (rules.getUniqueAttributes() == null || rules.getUniqueAttributes().isEmpty()) {
            return false;
        }

        List<AttributeValue> changedUniqueFields = new ArrayList<>();
        for (int i = 0; i < fieldNames.length; i++) {
            String fieldName = fieldNames[i];
            if (rules.getUniqueAttributes().contains(fieldName)) {
                Object newValue = newValues[i];
                Object oldValue = oldValues[i];
                if (newValue != null && !Objects.equals(newValue, oldValue)) {
                    DBColumnConfig columnConfig = sqlDBConfig.getEntities().get(entityName).getAttributes()
                            .get(fieldName);
                    changedUniqueFields.add(new AttributeValue(fieldName, columnConfig.getTitleEn(),
                            columnConfig.getTitleAr(), newValue));
                }
            }
        }

        if (changedUniqueFields.isEmpty()) {
            return false;
        }

        validateUniqueConstraintsOptimized(BEFORE_UPDATE, entityName, changedUniqueFields, id);

        return false;
    }

    private void validateUniqueConstraintsOptimized(SQLDatabaseEvents event, String entityName,
                                                    List<AttributeValue> uniqueAttributes, Object entityId) {

        EntityManager em = null;
        try {
            em = this.getEntityManager();

            StringBuilder jpql = new StringBuilder("SELECT ");
            for (int i = 0; i < uniqueAttributes.size(); i++) {
                if (i > 0) jpql.append(", ");
                jpql.append("e.").append(uniqueAttributes.get(i).fieldName);
            }
            jpql.append(" FROM ").append(entityName).append(" e WHERE (");
            for (int i = 0; i < uniqueAttributes.size(); i++) {
                if (i > 0) jpql.append(" OR ");
                jpql.append("e.").append(uniqueAttributes.get(i).fieldName).append(" = :val").append(i);
            }
            jpql.append(")");
            if (entityId != null && BEFORE_UPDATE.equals(event)) jpql.append(" AND e.id != :id");

            Query query = em.createQuery(jpql.toString());
            for (int i = 0; i < uniqueAttributes.size(); i++) {
                query.setParameter("val" + i, uniqueAttributes.get(i).value);
            }
            if (entityId != null && BEFORE_UPDATE.equals(event)) {
                query.setParameter("id", entityId);
            }

            List<?> results;
            try {
                results = query.getResultList();
            } catch (Exception e) {
                return;
            }

            if (!results.isEmpty()) {
                Set<String> violatedFields = new LinkedHashSet<>();

                for (Object rowObj : results) {
                    Object[] row;
                    if (uniqueAttributes.size() == 1) {
                        row = new Object[]{rowObj};
                    } else {
                        row = (Object[]) rowObj;
                    }

                    for (int i = 0; i < uniqueAttributes.size(); i++) {
                        AttributeValue attr = uniqueAttributes.get(i);
                        if (row[i] != null && row[i].equals(attr.value)) {
                            String displayName = (attr.titleEn != null && !attr.titleEn.trim().isEmpty())
                                    ? attr.titleEn + " '" + row[i] + "'"
                                    : attr.fieldName + " '" + row[i] + "'";
                            violatedFields.add(displayName);
                        }
                    }
                }

                if (!violatedFields.isEmpty()) {
                    throw new BusinessException(
                            SQLDatabaseAdapterErrors.UNIQUE_CONSTRAINT_VIOLATION,
                            event.getOperation(),
                            entityName,
                            String.join(", ", violatedFields)
                    );
                }
            }
        } finally {
            if (em != null && em.isOpen()) {
                em.close();
            }
        }
    }

    record AttributeValue(String fieldName, String titleEn, String titleAr, Object value) {
    }
}
