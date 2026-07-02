package bs.service.employee.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import bs.service.employee.model.enums.SessionStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class CourseSessionSearchFilter extends SearchFilter<CourseSessionSearchFilter.OrderByAttributes> {

    private Boolean groupByCourse;
    private Boolean groupByTrainer;
    private List<Integer> employeeIdsIn;
    private Integer courseId;
    private String sessionDay;
    private Integer employeeId;
    private Integer placeId;
    private Integer status;
    private LocalDate sessionDateFrom;
    private LocalDate sessionDateTo;
    private LocalTime startTimeFrom;
    private LocalTime startTimeTo;
    private LocalTime endTimeFrom;
    private LocalTime endTimeTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        SESSION_DATE("item.sessionDate", false),
        START_TIME("item.startTime", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}