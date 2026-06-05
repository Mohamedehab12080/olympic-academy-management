package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.enrollment.EnrollmentRefund;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentRefundJPARepository extends JpaRepository<EnrollmentRefund, Integer> {
}