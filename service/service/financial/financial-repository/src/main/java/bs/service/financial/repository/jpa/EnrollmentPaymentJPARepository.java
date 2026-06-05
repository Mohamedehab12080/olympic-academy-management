package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.enrollment.EnrollmentPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentPaymentJPARepository extends JpaRepository<EnrollmentPayment, Integer> {
}