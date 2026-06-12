package bs.service.file.repository.query;

import jakarta.persistence.EntityManager;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Component;
import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilder;
import bs.service.file.model.entity.FlFileVersion;
import bs.service.file.model.filter.FileVersionSearchFilter;

import java.util.ArrayList;
import java.util.List;

@Component
public class FileVersionQueryBuilder extends AbstractQueryBuilder<FlFileVersion, FileVersionSearchFilter> {

    public FileVersionQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public Class getEntityNameClass() {
        return FlFileVersion.class;
    }

    @Override
    public List<String> evaluateWhereConditions(FileVersionSearchFilter filters) {
        List<String> conditions = new ArrayList<>();

        if (filters.getFileIds() != null)
            conditions.add("item.file.id IN :fileIds");

        if (filters.getFidVersions() != null)
            conditions.add("item.fidVersion IN :fidVersions");


        if (filters.getFids() != null)
            conditions.add("item.file.fid IN :fids");

        if (filters.getCreatedOnTo() != null) {
            conditions.add("item.createdOn <= :createdOnTo");
        }

        return conditions;
    }

    @Override
    public void setParameters(TypedQuery<?> query, FileVersionSearchFilter filters) {
        if (filters.getFileIds() != null) {
            query.setParameter("fileIds", filters.getFileIds());
        }

        if (filters.getFidVersions() != null)
            query.setParameter("fidVersions", filters.getFidVersions());

        if (filters.getFids() != null) {
            query.setParameter("fids", filters.getFids());
        }
        if (filters.getCreatedOnTo() != null) {
            query.setParameter("createdOnTo", filters.getCreatedOnTo());
        }
    }

}

