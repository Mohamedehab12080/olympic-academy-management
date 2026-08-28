package bs.service.employee.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TrainerDepartmentSearchFilter extends SearchFilter<TrainerDepartmentSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;
    private Boolean isActive;
    private Boolean isDeleted;
    private LocalDate createdOnFrom;
    private LocalDate createdOnTo;
    private Integer trainerId;
    private Integer departmentId;
    private List<Integer> departmentIds;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        CREATION_DATE("item.createdOn", false);
        private final String attributeName;
        private final Boolean isLocalized;
    }

}
