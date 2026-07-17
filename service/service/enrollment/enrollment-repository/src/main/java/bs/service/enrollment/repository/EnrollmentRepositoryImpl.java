package bs.service.enrollment.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.enrollment.repository.jpa.EnrollmentJPARepository;
import bs.service.enrollment.repository.query.EnrollmentQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EnrollmentRepositoryImpl implements EnrollmentRepository {

    private final EnrollmentJPARepository enrollmentJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final EnrollmentQueryBuilder queryBuilder;

    @Override
    public Enrollment insert(Enrollment enrollment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollment.setCreatedBy(currentUser);
        enrollment.setCreatedOn(LocalDateTime.now());
        enrollment.setIsActive(true);
        enrollment.setIsDeleted(false);
        return enrollmentJPARepository.save(enrollment);
    }

    @Override
    public Enrollment update(Enrollment enrollment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollment.setLastModifiedBy(currentUser);
        enrollment.setLastModifiedOn(LocalDateTime.now());
        return enrollmentJPARepository.save(enrollment);
    }

    @Override
    public void internalUpdate(Enrollment enrollment) {
        enrollment.setLastModifiedOn(LocalDateTime.now());
        enrollmentJPARepository.save(enrollment);
    }

    @Override
    public Optional<Enrollment> selectById(Integer id) {
        return enrollmentJPARepository.findById(id);
    }

    @Override
    public List<Enrollment> selectAllByFilters(EnrollmentSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(EnrollmentSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer id) {
        enrollmentJPARepository.deleteById(id);
    }
}