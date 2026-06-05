package bs.service.financial.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseSearchFilter extends SearchFilter<ExpenseSearchFilter.OrderByAttributes> {

    private Integer expenseTypeId;
    private Integer paymentMethodId;
    private LocalDate expenseDateFrom;
    private LocalDate expenseDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        EXPENSE_DATE("item.expenseDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}