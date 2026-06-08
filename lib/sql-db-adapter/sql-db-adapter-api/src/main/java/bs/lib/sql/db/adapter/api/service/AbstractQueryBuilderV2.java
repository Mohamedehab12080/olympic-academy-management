package bs.lib.sql.db.adapter.api.service;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import lombok.AllArgsConstructor;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;

import java.util.ArrayList;
import java.util.List;

import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterErrors.UN_SUPPORTED_ORDER_BY_ATTR;

@AllArgsConstructor
public abstract class AbstractQueryBuilderV2<ENTITY, FILTER extends SearchFilter<? extends OrderAttributes>> {
    private final EntityManager em;
    private final Class<ENTITY> ENTITY_CLASS_TYPE;
    private final Class<FILTER> FILTER_CLASS_TYPE;

    @SuppressWarnings("unchecked")
    public AbstractQueryBuilderV2(EntityManager em) {
        this.em = em;
        this.ENTITY_CLASS_TYPE = (Class<ENTITY>) ((java.lang.reflect.ParameterizedType) this.getClass()
                .getGenericSuperclass()).getActualTypeArguments()[0];
        this.FILTER_CLASS_TYPE = (Class<FILTER>) ((java.lang.reflect.ParameterizedType) this.getClass()
                .getGenericSuperclass()).getActualTypeArguments()[1];
    }

    public List<ENTITY> selectAllByFilters(FILTER filters) {
        String hql = "SELECT " + (isDistinct() ? "DISTINCT " : " ") + "item " +
                "FROM " + ENTITY_CLASS_TYPE.getCanonicalName() + " item "
                + this.joinQuery(filters);

        List<QBCondition> conditions = this.evaluateWhereConditions(filters);
        List<QBCondition> onConditions = this.evaluateOnConditions(filters);

        if (!conditions.isEmpty())
            hql += this.constructWhereCondition(conditions);

        hql += this.constructOrderStatement(filters);

        TypedQuery<ENTITY> query = em.createQuery(hql, ENTITY_CLASS_TYPE);

        List<QBCondition> allConditions = new ArrayList<>(conditions);
        if (onConditions != null) {
            allConditions.addAll(onConditions);
        }
        this.setParameters(query, allConditions);

        PaginationInfo pagination = filters.getPagination();
        if (pagination != null && pagination.isValidPagination() && !pagination.getNoPagination()) {
            query.setFirstResult(pagination.getPageNum() * pagination.getPageSize());
            query.setMaxResults(pagination.getPageSize());
        }
        return query.getResultList();
    }

    // FIXED: Keep Integer return type but convert from Long
    public Integer countAllByFilters(FILTER filters) {
        String hql = "SELECT COUNT(" + (isDistinct() ? "DISTINCT " : " ") + "item) " +
                "FROM " + ENTITY_CLASS_TYPE.getCanonicalName() + " item "
                + this.joinQuery(filters).replaceAll("(?i)FETCH", ""); // Remove FETCH keyword from join for count query

        List<QBCondition> conditions = this.evaluateWhereConditions(filters);
        List<QBCondition> onConditions = this.evaluateOnConditions(filters);

        if (!conditions.isEmpty())
            hql += this.constructWhereCondition(conditions);

        // Use Long for the query (Hibernate returns Long for COUNT)
        TypedQuery<Long> query = em.createQuery(hql, Long.class);

        List<QBCondition> allConditions = new ArrayList<>(conditions);
        if (onConditions != null) {
            allConditions.addAll(onConditions);
        }
        this.setParameters(query, allConditions);

        Long result = query.getSingleResult();
        // Convert Long to Integer (safe because count won't exceed Integer.MAX_VALUE)
        return result != null ? result.intValue() : 0;
    }

    protected String constructWhereCondition(List<QBCondition> conditions) {
        StringBuilder whereClause = new StringBuilder(" WHERE ");
        for (int i = 0; i < conditions.size(); i++) {
            String condition = conditions.get(i).getCondition().replaceAll(":PH", ":" + conditions.get(i).getPlaceHolder());
            whereClause.append(condition);
            if (i < conditions.size() - 1) {
                whereClause.append(" AND ");
            }
        }
        return whereClause.toString();
    }

    protected String constructOrderStatement(SortingInfo<? extends OrderAttributes> sortingInfo) {
        try {
            OrderAttributes orderBy = sortingInfo.getOrderAttribute(this.FILTER_CLASS_TYPE);
            String orderByStr = orderBy.getAttributeName();
            return " ORDER BY " + orderByStr + " " + sortingInfo.getDir();
        } catch (IllegalArgumentException ex) {
            throw new BusinessException(ex, UN_SUPPORTED_ORDER_BY_ATTR, sortingInfo.getBy());
        }
    }

    protected String constructOrderStatement(FILTER filters) {
        if (filters.getSorting() != null && filters.getSorting().getIsApplied())
            return this.constructOrderStatement(filters.getSorting());
        else if (filters.getDefaultSorting() != null && filters.getDefaultSorting().getIsApplied())
            return this.constructOrderStatement(filters.getDefaultSorting());
        else
            return "";
    }

    public String joinQuery(FILTER filters) {
        return "";
    }

    public Boolean isDistinct() {
        return false;
    }

    public abstract List<QBCondition> evaluateWhereConditions(FILTER filters);
    public List<QBCondition> evaluateOnConditions(FILTER filters){return List.of();};

    public void setParameters(TypedQuery<?> query, List<QBCondition> conditions) {
        for (QBCondition condition : conditions) {
            query.setParameter(condition.getPlaceHolder(), condition.getValue());
        }
    }
}