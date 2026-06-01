package bs.service.employee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.filter.EmployeeSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EmployeeQueryBuilder extends AbstractQueryBuilderV2<Employee, EmployeeSearchFilter> {

    public EmployeeQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EmployeeSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("fullName").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.fullName) LIKE LOWER(:PH) OR item.nationalId LIKE :PH)").build());

        if (filters.getCreatedOnFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnFrom").value(filters.getCreatedOnFrom())
                    .condition("item.createdOn >= :PH").build());

        if (filters.getCreatedOnTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnTo").value(filters.getCreatedOnTo())
                    .condition("item.createdOn <= :PH").build());

        if (filters.getHireDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("hireDateFrom").value(filters.getHireDateFrom())
                    .condition("item.hireDate >= :PH").build());

        if (filters.getHireDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("hireDateTo").value(filters.getHireDateTo())
                    .condition("item.hireDate <= :PH").build());

        if (filters.getGender() != null)
            qbConditions.add(QBCondition.builder().placeHolder("gender").value(filters.getGender())
                    .condition("item.gender = :PH").build());

        if (filters.getEmployeeType() != null)
            qbConditions.add(QBCondition.builder().placeHolder("employeeType").value(filters.getEmployeeType())
                    .condition("item.employeeType = :PH").build());

        if (filters.getSalaryType() != null)
            qbConditions.add(QBCondition.builder().placeHolder("salaryType").value(filters.getSalaryType())
                    .condition("item.salaryType = :PH").build());

        if (filters.getIsActive() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isActive").value(filters.getIsActive())
                    .condition("item.isActive = :PH").build());

        return qbConditions;
    }
}