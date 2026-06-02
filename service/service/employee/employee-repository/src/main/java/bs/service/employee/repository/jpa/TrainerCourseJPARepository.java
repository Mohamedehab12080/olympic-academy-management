package bs.service.employee.repository.jpa;

import bs.service.employee.model.entity.TrainerCourse;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainerCourseJPARepository extends JpaRepository<TrainerCourse, Integer> {
}