package bs.service.financial.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import bs.service.financial.model.enums.SalaryTransactionType;
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
public class SalaryIncentiveSearchFilter extends SearchFilter<SalaryIncentiveSearchFilter.OrderByAttributes> {

    private Boolean isDeleted;
    private String employeeNationalId;
    private String quickSearch;
    private Integer employeeId;
    private Integer paymentMethodId;
    private Integer salaryTransactionType;
    private LocalDate withdrawDateFrom;
    private LocalDate withdrawDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        WITHDRAW_DATE("item.withdrawDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}