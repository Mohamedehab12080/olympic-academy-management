package bs.service.employee.model.filter;

import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.user.model.generated.Genders;
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
public class EmployeeSearchFilter extends SearchFilter<EmployeeSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;
    private Boolean isActive;
    private LocalDate createdOnFrom;
    private LocalDate createdOnTo;
    private LocalDate hireDateFrom;
    private LocalDate hireDateTo;
    private Genders gender;
    private EmployeeTypes employeeType;
    private SalaryTypes salaryType;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        FULL_NAME("item.fullName", false),
        HIRE_DATE("item.hireDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}