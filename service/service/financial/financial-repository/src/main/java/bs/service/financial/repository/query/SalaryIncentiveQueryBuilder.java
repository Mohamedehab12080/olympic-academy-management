package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.salary.incentive.SalaryIncentive;
import bs.service.financial.model.filter.SalaryIncentiveSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class SalaryIncentiveQueryBuilder extends AbstractQueryBuilderV2<SalaryIncentive, SalaryIncentiveSearchFilter> {

    public SalaryIncentiveQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(SalaryIncentiveSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getEmployeeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("employeeId").value(filters.getEmployeeId())
                    .condition("item.employee.id = :PH").build());

        if (filters.getPaymentMethodId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentMethodId").value(filters.getPaymentMethodId())
                    .condition("item.paymentMethod.id = :PH").build());

        if (filters.getType() != null)
            qbConditions.add(QBCondition.builder().placeHolder("type").value(filters.getType())
                    .condition("item.type = :PH").build());

        if (filters.getWithdrawDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("withdrawDateFrom").value(filters.getWithdrawDateFrom())
                    .condition("item.withdrawDate >= :PH").build());

        if (filters.getWithdrawDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("withdrawDateTo").value(filters.getWithdrawDateTo())
                    .condition("item.withdrawDate <= :PH").build());

        return qbConditions;
    }
}