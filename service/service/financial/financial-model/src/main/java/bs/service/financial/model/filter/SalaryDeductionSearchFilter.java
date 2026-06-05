package bs.service.financial.model.filter;

import bs.lib.common.model.enums.SalaryTypes;
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
public class SalaryDeductionSearchFilter extends SearchFilter<SalaryDeductionSearchFilter.OrderByAttributes> {

    private Integer employeeId;
    private SalaryTypes salaryType;
    private LocalDate deductionDateFrom;
    private LocalDate deductionDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        DEDUCTION_DATE("item.deductionDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}