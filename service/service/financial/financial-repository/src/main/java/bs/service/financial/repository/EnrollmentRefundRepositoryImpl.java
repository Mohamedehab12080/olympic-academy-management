package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.EnrollmentRefundRepository;
import bs.service.financial.model.entity.enrollment.EnrollmentRefund;
import bs.service.financial.model.filter.EnrollmentRefundSearchFilter;
import bs.service.financial.repository.jpa.EnrollmentRefundJPARepository;
import bs.service.financial.repository.query.EnrollmentRefundQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EnrollmentRefundRepositoryImpl implements EnrollmentRefundRepository {

    private final EnrollmentRefundJPARepository enrollmentRefundJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final EnrollmentRefundQueryBuilder queryBuilder;

    @Override
    public EnrollmentRefund insert(EnrollmentRefund enrollmentRefund) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollmentRefund.setCreatedBy(currentUser);
        enrollmentRefund.setCreatedOn(LocalDateTime.now());
        enrollmentRefund.setIsDeleted(false);
        return enrollmentRefundJPARepository.save(enrollmentRefund);
    }

    @Override
    public EnrollmentRefund update(EnrollmentRefund enrollmentRefund) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollmentRefund.setLastModifiedBy(currentUser);
        enrollmentRefund.setLastModifiedOn(LocalDateTime.now());
        return enrollmentRefundJPARepository.save(enrollmentRefund);
    }

    @Override
    public Optional<EnrollmentRefund> selectById(Integer id) {
        return enrollmentRefundJPARepository.findById(id);
    }

    @Override
    public List<EnrollmentRefund> selectAllByFilters(EnrollmentRefundSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(EnrollmentRefundSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}