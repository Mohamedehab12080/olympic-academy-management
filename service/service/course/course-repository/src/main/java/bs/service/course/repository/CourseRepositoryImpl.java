package bs.service.course.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.course.api.repository.CourseRepository;
import bs.service.course.model.entity.Course;
import bs.service.course.model.filter.CourseSearchFilter;
import bs.service.course.repository.jpa.CourseJPARepository;
import bs.service.course.repository.query.CourseQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class CourseRepositoryImpl implements CourseRepository {

    private final CourseJPARepository courseJPARepository;
    private final CourseQueryBuilder queryBuilder;
    private final SecurityUtilsService securityUtilsService;

    @Override
    public Course insert(Course course) {
        User currentUser=User.builder().id(securityUtilsService.getCurrentUserId()).build();
        course.setCreatedOn(LocalDateTime.now());
        course.setCreatedBy(currentUser);
        course.setIsActive(true);
        course.setIsDeleted(false);
        return courseJPARepository.save(course);
    }

    @Override
    public Course update(Course course) {
        User currentUser=User.builder().id(securityUtilsService.getCurrentUserId()).build();
        course.setLastModifiedOn(LocalDateTime.now());
        course.setLastModifiedBy(currentUser);
        return courseJPARepository.save(course);
    }

    @Override
    public Optional<Course> selectById(Integer id) {
        return courseJPARepository.findById(id);
    }

    @Override
    public List<Course> selectAllByFilter(CourseSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilter(CourseSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}
