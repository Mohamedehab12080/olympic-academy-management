package bs.service.enrollment.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EnrollmentQueryBuilder extends AbstractQueryBuilderV2<Enrollment, EnrollmentSearchFilter> {

    public EnrollmentQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EnrollmentSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("traineeFullName").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("LOWER(item.trainee.fullName) LIKE LOWER(:PH) OR item.trainee.nationalId LIKE (:PH)").build());

        if (filters.getIsActive() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isActive").value(filters.getIsActive())
                    .condition("item.isActive = :PH").build());

        if (filters.getIsDeleted() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isDeleted").value(filters.getIsDeleted())
                    .condition("item.isDeleted = :PH").build());

        if (filters.getTraineeNationalId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("traineeNationalId").value(filters.getTraineeNationalId())
                    .condition("item.trainee.nationalId = :PH").build());

        if (filters.getTraineeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("traineeId").value(filters.getTraineeId())
                    .condition("item.trainee.id = :PH").build());

        if (filters.getCourseId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("courseId").value(filters.getCourseId())
                    .condition("item.course.id = :PH").build());

        if (filters.getCourseIds() != null && !filters.getCourseIds().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("courseIds").value(filters.getCourseIds())
                    .condition("item.course.id IN :PH").build());

        if (filters.getTrainerId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("trainerId").value(filters.getTrainerId())
                    .condition("item.trainer.id = :PH").build());

        if (filters.getEnrollmentTypeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("enrollmentTypeId").value(filters.getEnrollmentTypeId())
                    .condition("item.enrollmentType.id = :PH").build());

        if (filters.getEnrollmentStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("enrollmentStatus").value(filters.getEnrollmentStatus())
                    .condition("item.enrollmentStatus = :PH").build());

        if (filters.getPaymentStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentStatus").value(filters.getPaymentStatus())
                    .condition("item.paymentStatus = :PH").build());

        if (filters.getStartDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("startDateFrom").value(filters.getStartDateFrom())
                    .condition("item.startDate >= :PH").build());

        if (filters.getStartDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("startDateTo").value(filters.getStartDateTo())
                    .condition("item.startDate <= :PH").build());

        if (filters.getEndDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("endDateFrom").value(filters.getEndDateFrom())
                    .condition("item.endDate >= :PH").build());

        if (filters.getEndDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("endDateTo").value(filters.getEndDateTo())
                    .condition("item.endDate <= :PH").build());

        if (filters.getCreatedOnFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnFrom").value(filters.getCreatedOnFrom())
                    .condition("item.createdOn >= :PH").build());

        if (filters.getCreatedOnTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnTo").value(filters.getCreatedOnTo())
                    .condition("item.createdOn <= :PH").build());

        return qbConditions;
    }
}