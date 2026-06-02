package bs.service.enrollment.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.enrollment.api.repository.EnrollmentTypeRepository;
import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.filter.EnrollmentTypeSearchFilter;
import bs.service.enrollment.repository.jpa.EnrollmentTypeJPARepository;
import bs.service.enrollment.repository.query.EnrollmentTypeQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EnrollmentTypeRepositoryImpl implements EnrollmentTypeRepository {

    private final EnrollmentTypeJPARepository enrollmentTypeJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final EnrollmentTypeQueryBuilder queryBuilder;

    @Override
    public EnrollmentType insert(EnrollmentType enrollmentType) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollmentType.setCreatedBy(currentUser);
        enrollmentType.setCreatedOn(LocalDateTime.now());
        enrollmentType.setIsDeleted(false);
        return enrollmentTypeJPARepository.save(enrollmentType);
    }

    @Override
    public EnrollmentType update(EnrollmentType enrollmentType) {
        return enrollmentTypeJPARepository.save(enrollmentType);
    }

    @Override
    public Optional<EnrollmentType> selectById(Integer id) {
        return enrollmentTypeJPARepository.findById(id);
    }

    @Override
    public List<EnrollmentType> selectAllByFilters(EnrollmentTypeSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(EnrollmentTypeSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}