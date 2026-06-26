package bs.service.employee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.employee.model.entity.CourseSession;
import bs.service.employee.model.filter.CourseSessionSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class CourseSessionQueryBuilder extends AbstractQueryBuilderV2<CourseSession, CourseSessionSearchFilter> {

    public CourseSessionQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(CourseSessionSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getSessionDay() != null && !filters.getSessionDay().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("sessionDay").value("%" + filters.getSessionDay() + "%")
                    .condition("(LOWER(item.sessionDay) LIKE LOWER(:PH))").build());

        if (filters.getCourseId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("courseId").value(filters.getCourseId())
                    .condition("item.course.id = :PH").build());

        if (filters.getEmployeeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("trainerId").value(filters.getEmployeeId())
                    .condition("item.trainer.id = :PH").build());

        if (filters.getPlaceId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("placeId").value(filters.getPlaceId())
                    .condition("item.place.id = :PH").build());

        if (filters.getStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("status").value(filters.getStatus())
                    .condition("item.status = :PH").build());

        if (filters.getSessionDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("sessionDateFrom").value(filters.getSessionDateFrom())
                    .condition("item.sessionDate >= :PH").build());

        if (filters.getSessionDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("sessionDateTo").value(filters.getSessionDateTo())
                    .condition("item.sessionDate <= :PH").build());

        if (filters.getStartTimeFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("startTimeFrom").value(filters.getStartTimeFrom())
                    .condition("item.startTime >= :PH").build());

        if (filters.getStartTimeTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("startTimeTo").value(filters.getStartTimeTo())
                    .condition("item.startTime <= :PH").build());

        if (filters.getEndTimeFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("endTimeFrom").value(filters.getEndTimeFrom())
                    .condition("item.endTime >= :PH").build());

        if (filters.getEndTimeTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("endTimeTo").value(filters.getEndTimeTo())
                    .condition("item.endTime <= :PH").build());

        return qbConditions;
    }
}