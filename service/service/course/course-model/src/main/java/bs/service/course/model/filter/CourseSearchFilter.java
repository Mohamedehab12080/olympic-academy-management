package bs.service.course.model.filter;

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
public class CourseSearchFilter extends SearchFilter<CourseSearchFilter.OrderByAttributes> {

    private Boolean isPublic;
    private List<Integer> courseIds;
    private Integer departmentId;
    private String quickSearchQuery;
    private Integer courseType;
    private Boolean isActive;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private LocalDate endDateFrom;
    private LocalDate endDateTo;
    private Boolean isDeleted;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        START_DATE("item.startDate", false),
        COURSE_NAME("item.title", false);
        private final String attributeName;
        private final Boolean isLocalized;
    }
}