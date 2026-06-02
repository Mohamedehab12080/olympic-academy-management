package bs.service.enrollment.repository.jpa;

import bs.service.enrollment.model.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnrollmentJPARepository extends JpaRepository<Enrollment, Integer> {
}