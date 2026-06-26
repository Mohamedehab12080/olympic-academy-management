package bs.service.employee.api.repository;

import bs.service.employee.model.entity.CourseSession;
import bs.service.employee.model.filter.CourseSessionSearchFilter;

import java.util.List;
import java.util.Optional;

public interface CourseSessionRepository {
    CourseSession insert(CourseSession courseSession);
    CourseSession update(CourseSession courseSession);
    Optional<CourseSession> selectById(Integer id);
    List<CourseSession> selectAllByFilters(CourseSessionSearchFilter filters);
    Integer countAllByFilters(CourseSessionSearchFilter filters);
    void delete(Integer id);
}