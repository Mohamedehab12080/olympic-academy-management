package bs.service.course.repository.jpa;

import bs.service.course.model.entity.Course;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseJPARepository extends JpaRepository<Course, Integer> {
}
