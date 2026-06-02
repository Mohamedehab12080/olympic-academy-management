package bs.service.employee.repository.jpa;

import bs.service.employee.model.entity.CourseSession;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseSessionJPARepository extends JpaRepository<CourseSession, Integer> {
}