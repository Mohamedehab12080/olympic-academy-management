package bs.service.employee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.employee.model.entity.EmployeeDepartment;
import bs.service.employee.model.filter.TrainerDepartmentSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TrainerDepartmentQueryBuilder  extends AbstractQueryBuilderV2<EmployeeDepartment, TrainerDepartmentSearchFilter> {

    public TrainerDepartmentQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(TrainerDepartmentSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("fullName").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.department.title) LIKE LOWER(:PH) OR LOWER(item.employee.fullName) LIKE LOWER(:PH))").build());

        if (filters.getTrainerId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("trainerId").value(filters.getTrainerId())
                    .condition("item.employee.id = :PH").build());

        if (filters.getDepartmentId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("departmentId").value(filters.getDepartmentId())
                    .condition("item.department.id = :PH").build());

        if (filters.getCreatedOnFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnFrom").value(filters.getCreatedOnFrom())
                    .condition("item.createdOn >= :PH").build());

        if (filters.getCreatedOnTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnTo").value(filters.getCreatedOnTo().atStartOfDay())
                    .condition("item.createdOn <= :PH").build());

        return qbConditions;
    }
}
