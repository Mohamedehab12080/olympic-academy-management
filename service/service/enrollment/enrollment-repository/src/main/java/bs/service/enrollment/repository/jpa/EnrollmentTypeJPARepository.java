package bs.service.enrollment.repository.jpa;

import bs.service.enrollment.model.entity.EnrollmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


public interface EnrollmentTypeJPARepository extends JpaRepository<EnrollmentType, Integer> {
}