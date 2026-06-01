package bs.service.department.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.department.model.entity.Department;
import bs.service.department.model.filter.DepartmentSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class DepartmentQueryBuilder extends AbstractQueryBuilderV2<Department, DepartmentSearchFilter> {

    public DepartmentQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(DepartmentSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("Title").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.title) LIKE LOWER(:PH))").build());
        if (filters.getCreatedOnFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("CreatedOnFrom").value(filters.getCreatedOnFrom())
                    .condition("item.createdOn >= :PH").build());
        if (filters.getCreatedOnTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("CreatedOnTo").value(filters.getCreatedOnTo())
                    .condition("item.createdOn <= :PH").build());
        if (filters.getIsActive() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isActive").value(filters.getIsActive())
                    .condition("item.isActive = :PH").build());
        return qbConditions;
    }
}
