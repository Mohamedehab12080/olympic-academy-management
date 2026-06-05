package bs.service.financial.api.repository;

import bs.service.financial.model.entity.enrollment.EnrollmentRefund;
import bs.service.financial.model.filter.EnrollmentRefundSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRefundRepository {
    EnrollmentRefund insert(EnrollmentRefund enrollmentRefund);
    EnrollmentRefund update(EnrollmentRefund enrollmentRefund);
    Optional<EnrollmentRefund> selectById(Integer id);
    List<EnrollmentRefund> selectAllByFilters(EnrollmentRefundSearchFilter filters);
    Integer countAllByFilters(EnrollmentRefundSearchFilter filters);
}