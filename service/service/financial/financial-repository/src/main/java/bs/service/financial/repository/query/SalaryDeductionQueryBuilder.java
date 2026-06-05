package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.salary.deduction.SalaryDeduction;
import bs.service.financial.model.filter.SalaryDeductionSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SalaryDeductionQueryBuilder extends AbstractQueryBuilderV2<SalaryDeduction, SalaryDeductionSearchFilter> {

    public SalaryDeductionQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(SalaryDeductionSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getEmployeeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("employeeId").value(filters.getEmployeeId())
                    .condition("item.employee.id = :PH").build());

        if (filters.getSalaryType() != null)
            qbConditions.add(QBCondition.builder().placeHolder("salaryType").value(filters.getSalaryType())
                    .condition("item.salaryType = :PH").build());

        if (filters.getDeductionDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("deductionDateFrom").value(filters.getDeductionDateFrom())
                    .condition("item.deductionDate >= :PH").build());

        if (filters.getDeductionDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("deductionDateTo").value(filters.getDeductionDateTo())
                    .condition("item.deductionDate <= :PH").build());

        return qbConditions;
    }
}