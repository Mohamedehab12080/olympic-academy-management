package bs.service.department.model.filter;

import bs.olympic.common.db.model.dto.SearchFilter;
import bs.olympic.common.db.model.interfaces.OrderAttributes;
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
public class DepartmentSearchFilter extends SearchFilter<DepartmentSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;
    private Boolean isActive;
    private LocalDate createdOnFrom;
    private LocalDate createdOnTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        CREATION_DATE("item.createdOn", false),
        DEPARTMENT_NAME("item.title", false);
        private final String attributeName;
        private final Boolean isLocalized;
    }
}
