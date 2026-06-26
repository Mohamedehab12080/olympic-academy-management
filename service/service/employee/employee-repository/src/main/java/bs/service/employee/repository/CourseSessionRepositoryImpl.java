package bs.service.employee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.employee.api.repository.CourseSessionRepository;
import bs.service.employee.model.entity.CourseSession;
import bs.service.employee.model.filter.CourseSessionSearchFilter;
import bs.service.employee.repository.jpa.CourseSessionJPARepository;
import bs.service.employee.repository.query.CourseSessionQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class CourseSessionRepositoryImpl implements CourseSessionRepository {

    private final CourseSessionJPARepository courseSessionJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final CourseSessionQueryBuilder queryBuilder;

    @Override
    public CourseSession insert(CourseSession courseSession) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        courseSession.setCreatedBy(currentUser);
        courseSession.setCreatedOn(LocalDateTime.now());
        courseSession.setIsDeleted(false);
        return courseSessionJPARepository.save(courseSession);
    }

    @Override
    public CourseSession update(CourseSession courseSession) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        courseSession.setLastModifiedBy(currentUser);
        courseSession.setLastModifiedOn(LocalDateTime.now());
        return courseSessionJPARepository.save(courseSession);
    }

    @Override
    public Optional<CourseSession> selectById(Integer id) {
        return courseSessionJPARepository.findById(id);
    }

    @Override
    public List<CourseSession> selectAllByFilters(CourseSessionSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(CourseSessionSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void delete(Integer id) {
        courseSessionJPARepository.deleteById(id);
    }
}