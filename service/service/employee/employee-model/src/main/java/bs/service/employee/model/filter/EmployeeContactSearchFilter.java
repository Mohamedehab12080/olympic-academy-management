package bs.service.employee.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;


@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeContactSearchFilter extends SearchFilter<EmployeeContactSearchFilter.OrderByAttributes> {

    private Integer employeeId;
    private String contactName;
    private String contactValue;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        CONTACT_NAME("item.contactName", false);
        private final String attributeName;
        private final Boolean isLocalized;
    }
}