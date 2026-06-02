package bs.service.employee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.employee.model.entity.TrainerCourse;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TrainerCourseQueryBuilder extends AbstractQueryBuilderV2<TrainerCourse, TrainerCourseSearchFilter> {

    public TrainerCourseQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(TrainerCourseSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getTrainerId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("trainerId").value(filters.getTrainerId())
                    .condition("item.employee.id = :PH").build());

        if (filters.getCourseId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("courseId").value(filters.getCourseId())
                    .condition("item.course.id = :PH").build());

        return qbConditions;
    }
}