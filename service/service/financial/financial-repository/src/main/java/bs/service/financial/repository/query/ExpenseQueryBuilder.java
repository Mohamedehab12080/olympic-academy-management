package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.expense.Expense;
import bs.service.financial.model.filter.ExpenseSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ExpenseQueryBuilder extends AbstractQueryBuilderV2<Expense, ExpenseSearchFilter> {

    public ExpenseQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(ExpenseSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();


        if (filters.getIsDeleted() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isDeleted").value(filters.getIsDeleted())
                    .condition("item.isDeleted = :PH").build());

        if (filters.getExpenseTypeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("expenseTypeId").value(filters.getExpenseTypeId())
                    .condition("item.expenseType.id = :PH").build());

        if (filters.getPaymentMethodId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentMethodId").value(filters.getPaymentMethodId())
                    .condition("item.paymentMethod.id = :PH").build());

        if (filters.getExpenseDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("expenseDateFrom").value(filters.getExpenseDateFrom())
                    .condition("item.expenseDate >= :PH").build());

        if (filters.getExpenseDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("expenseDateTo").value(filters.getExpenseDateTo())
                    .condition("item.expenseDate <= :PH").build());

        return qbConditions;
    }
}