package bs.service.employee.api.repository;

import bs.service.employee.model.entity.TrainerCourse;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;

import java.util.List;
import java.util.Optional;

public interface TrainerCourseRepository {
    TrainerCourse insert(TrainerCourse trainerCourse);
    void delete(TrainerCourse trainerCourse);
    Optional<TrainerCourse> selectById(Integer id);
    List<TrainerCourse> selectAllByFilters(TrainerCourseSearchFilter filters);
    Integer countAllByFilters(TrainerCourseSearchFilter filters);
}