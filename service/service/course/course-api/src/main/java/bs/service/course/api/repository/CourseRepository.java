package bs.service.course.api.repository;

import bs.service.course.model.entity.Course;
import bs.service.course.model.filter.CourseSearchFilter;

import java.util.List;
import java.util.Optional;

public interface CourseRepository {
    Course insert(Course course);
    Course update(Course course);
    Optional<Course> selectById(Integer id);
    List<Course> selectAllByFilter(CourseSearchFilter filters);
    Integer countAllByFilter(CourseSearchFilter filters);
}
