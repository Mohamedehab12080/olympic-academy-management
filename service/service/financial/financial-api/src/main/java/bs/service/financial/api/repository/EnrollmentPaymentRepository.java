package bs.service.financial.api.repository;

import bs.service.financial.model.entity.enrollment.EnrollmentPayment;
import bs.service.financial.model.filter.EnrollmentPaymentSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EnrollmentPaymentRepository {
    EnrollmentPayment insert(EnrollmentPayment enrollmentPayment);
    EnrollmentPayment update(EnrollmentPayment enrollmentPayment);
    Optional<EnrollmentPayment> selectById(Integer id);
    List<EnrollmentPayment> selectAllByFilters(EnrollmentPaymentSearchFilter filters);
    Integer countAllByFilters(EnrollmentPaymentSearchFilter filters);
}