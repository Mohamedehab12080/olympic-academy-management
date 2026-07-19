package bs.service.course.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.course.model.entity.Course;
import bs.service.course.model.filter.CourseSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;


@Repository
public class CourseQueryBuilder extends AbstractQueryBuilderV2<Course, CourseSearchFilter> {

    public CourseQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(CourseSearchFilter filters) {
        List<QBCondition> conditions = new ArrayList<>();

        if (filters.getEndDateFrom() != null)
            conditions.add(QBCondition.builder().placeHolder("endDateFrom").value(filters.getEndDateFrom())
                    .condition("item.endDate >= :PH").build());

        if (filters.getEndDateTo() != null)
            conditions.add(QBCondition.builder().placeHolder("endDateTo").value(filters.getEndDateTo())
                    .condition("item.endDate <= :PH").build());

        if (filters.getStartDateFrom() != null)
            conditions.add(QBCondition.builder().placeHolder("startDateFrom").value(filters.getStartDateFrom())
                    .condition("item.startDate >= :PH").build());

        if (filters.getStartDateTo() != null)
            conditions.add(QBCondition.builder().placeHolder("startDateTo").value(filters.getStartDateTo())
                    .condition("item.startDate <= :PH").build());

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            conditions.add(QBCondition.builder().placeHolder("title").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("item.title LIKE :PH").build());

        if (filters.getCourseIds() != null && !filters.getCourseIds().isEmpty())
            conditions.add(QBCondition.builder().placeHolder("courseIds").value(filters.getCourseIds())
                    .condition("item.id IN :PH").build());

        if (filters.getDepartmentId() != null)
            conditions.add(QBCondition.builder().placeHolder("departmentId").value(filters.getDepartmentId())
                    .condition("item.department.id = :PH").build());

        if (filters.getIsPublic() != null)
            conditions.add(QBCondition.builder().placeHolder("isPublic").value(filters.getIsPublic())
                    .condition("item.isPublic = :PH").build());

        if (filters.getCourseType() != null)
            conditions.add(QBCondition.builder().placeHolder("courseType").value(filters.getCourseType())
                    .condition("item.courseType = :PH").build());


        if (filters.getIsActive() != null)
            conditions.add(QBCondition.builder().placeHolder("isActive").value(filters.getIsActive())
                    .condition("item.isActive = :PH").build());

        return conditions;

    }
}
