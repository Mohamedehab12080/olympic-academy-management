package bs.service.course.model.filter;

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
public class CourseSearchFilter extends SearchFilter<CourseSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;
    private String courseType;
    private Boolean isActive;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private LocalDate endDateFrom;
    private LocalDate endDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        START_DATE("item.startDate", false),
        COURSE_NAME("item.title", false);
        private final String attributeName;
        private final Boolean isLocalized;
    }
}