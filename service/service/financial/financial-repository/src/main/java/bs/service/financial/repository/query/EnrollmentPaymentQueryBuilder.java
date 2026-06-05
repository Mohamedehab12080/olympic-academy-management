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

        if (filters.getEnrollmentId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("enrollmentId").value(filters.getEnrollmentId())
                    .condition("item.enrollment.id = :PH").build());

        if (filters.getPaymentMethodId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentMethodId").value(filters.getPaymentMethodId())
                    .condition("item.paymentMethod.id = :PH").build());

        if (filters.getStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("status").value(filters.getStatus())
                    .condition("item.status = :PH").build());

        if (filters.getPaymentDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentDateFrom").value(filters.getPaymentDateFrom())
                    .condition("item.paymentDate >= :PH").build());

        if (filters.getPaymentDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentDateTo").value(filters.getPaymentDateTo())
                    .condition("item.paymentDate <= :PH").build());

        return qbConditions;
    }
}