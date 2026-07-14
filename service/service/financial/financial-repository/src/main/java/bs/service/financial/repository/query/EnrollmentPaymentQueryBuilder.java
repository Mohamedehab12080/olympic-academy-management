package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.enrollment.EnrollmentPayment;
import bs.service.financial.model.filter.EnrollmentPaymentSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EnrollmentPaymentQueryBuilder extends AbstractQueryBuilderV2<EnrollmentPayment, EnrollmentPaymentSearchFilter> {

    public EnrollmentPaymentQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EnrollmentPaymentSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearch() != null && !filters.getQuickSearch().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("quickSearch").value("%" + filters.getQuickSearch() + "%")
                    .condition("LOWER(item.enrollment.trainee.fullName) LIKE LOWER(:PH)").build());

        if (filters.getIsDeleted() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isDeleted").value(filters.getIsDeleted())
                    .condition("item.isDeleted = :PH").build());

        if (filters.getTraineeNationalId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("traineeNationalId").value(filters.getTraineeNationalId())
                    .condition("item.enrollment.trainee.nationalId = :PH").build());

        if (filters.getEnrollmentId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("enrollmentId").value(filters.getEnrollmentId())
                    .condition("item.enrollment.id = :PH").build());

        if (filters.getCourseId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("courseId").value(filters.getCourseId())
                    .condition("item.enrollment.course.id = :PH").build());

        if (filters.getPaymentMethodId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentMethodId").value(filters.getPaymentMethodId())
                    .condition("item.paymentMethod.id = :PH").build());

        if (filters.getStatuses() != null && !filters.getStatuses().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("statuses").value(filters.getStatuses())
                    .condition("item.paymentStatus IN :PH").build());

        if (filters.getPaymentDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentDateFrom").value(filters.getPaymentDateFrom())
                    .condition("item.paymentDate >= :PH").build());

        if (filters.getPaymentDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentDateTo").value(filters.getPaymentDateTo())
                    .condition("item.paymentDate <= :PH").build());

        return qbConditions;
    }
}