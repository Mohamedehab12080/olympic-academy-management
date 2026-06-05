package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.enrollment.EnrollmentRefund;
import bs.service.financial.model.filter.EnrollmentRefundSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EnrollmentRefundQueryBuilder extends AbstractQueryBuilderV2<EnrollmentRefund, EnrollmentRefundSearchFilter> {

    public EnrollmentRefundQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EnrollmentRefundSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getEnrollmentId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("enrollmentId").value(filters.getEnrollmentId())
                    .condition("item.enrollment.id = :PH").build());

        if (filters.getPaymentMethodId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentMethodId").value(filters.getPaymentMethodId())
                    .condition("item.paymentMethod.id = :PH").build());

        if (filters.getStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("status").value(filters.getStatus())
                    .condition("item.status = :PH").build());

        if (filters.getRefundDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("refundDateFrom").value(filters.getRefundDateFrom())
                    .condition("item.refundDate >= :PH").build());

        if (filters.getRefundDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("refundDateTo").value(filters.getRefundDateTo())
                    .condition("item.refundDate <= :PH").build());

        return qbConditions;
    }
}