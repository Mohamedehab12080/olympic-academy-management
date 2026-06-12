package bs.service.file.repository.query;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;
import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilder;
import bs.service.file.model.entity.FlFile;
import bs.service.file.model.filter.FileSearchFilter;

import java.util.ArrayList;
import java.util.List;

@Component
public class FileQueryBuilder extends AbstractQueryBuilder<FlFile, FileSearchFilter> {

    public FileQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public Class getEntityNameClass() {
        return FlFile.class;
    }

    @Override
    public List<String> evaluateWhereConditions(FileSearchFilter filters) {
        List<String> conditions = new ArrayList<>();

        if (filters.getDomainId() != null)
            conditions.add("item.domain.id=:domainId");

        if (filters.getEntityId() != null)
            conditions.add("item.entityId=:entityId");


        if (filters.getIsEntityIdIsNull() != null && filters.getIsEntityIdIsNull())
            conditions.add("item.entityId IS NULL");


        if (filters.getFids() != null && !filters.getFids().isEmpty()) {
            conditions.add("item.fid IN :fids");
        }

        if (filters.getCreatedOnTo() != null) {
            conditions.add("item.createdOn <= :createdOnTo");
        }

        return conditions;
    }

    @Override
    public void setParameters(TypedQuery<?> query, FileSearchFilter filters) {
        if(filters.getDomainId()!=null){
            query.setParameter("domainId", filters.getDomainId());
        }

        if (filters.getEntityId() != null)
            query.setParameter("entityId", filters.getEntityId());

        if(filters.getFids()!=null && !filters.getFids().isEmpty()){
            query.setParameter("fids", filters.getFids());
        }
        if (filters.getCreatedOnTo() != null) {
            query.setParameter("createdOnTo", filters.getCreatedOnTo());
        }
    }

}
