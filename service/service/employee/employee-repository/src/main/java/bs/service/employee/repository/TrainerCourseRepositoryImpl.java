package bs.service.employee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.employee.api.repository.TrainerCourseRepository;
import bs.service.employee.model.entity.TrainerCourse;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;
import bs.service.employee.repository.jpa.TrainerCourseJPARepository;
import bs.service.employee.repository.query.TrainerCourseQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class TrainerCourseRepositoryImpl implements TrainerCourseRepository {

    private final TrainerCourseJPARepository trainerCourseJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final TrainerCourseQueryBuilder queryBuilder;

    @Override
    public TrainerCourse insert(TrainerCourse trainerCourse) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        trainerCourse.setCreatedBy(currentUser);
        trainerCourse.setCreatedOn(LocalDateTime.now());
        trainerCourse.setIsDeleted(false);
        return trainerCourseJPARepository.save(trainerCourse);
    }

    @Override
    public void delete(TrainerCourse trainerCourse) {
        trainerCourseJPARepository.delete(trainerCourse);
    }

    @Override
    public Optional<TrainerCourse> selectById(Integer id) {
        return trainerCourseJPARepository.findById(id);
    }

    @Override
    public List<TrainerCourse> selectAllByFilters(TrainerCourseSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(TrainerCourseSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}