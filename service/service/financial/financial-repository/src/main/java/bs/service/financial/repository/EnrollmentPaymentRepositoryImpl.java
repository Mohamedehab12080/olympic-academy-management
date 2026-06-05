package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.EnrollmentPaymentRepository;
import bs.service.financial.model.entity.enrollment.EnrollmentPayment;
import bs.service.financial.model.filter.EnrollmentPaymentSearchFilter;
import bs.service.financial.repository.jpa.EnrollmentPaymentJPARepository;
import bs.service.financial.repository.query.EnrollmentPaymentQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EnrollmentPaymentRepositoryImpl implements EnrollmentPaymentRepository {

    private final EnrollmentPaymentJPARepository enrollmentPaymentJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final EnrollmentPaymentQueryBuilder queryBuilder;

    @Override
    public EnrollmentPayment insert(EnrollmentPayment enrollmentPayment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollmentPayment.setCreatedBy(currentUser);
        enrollmentPayment.setCreatedOn(LocalDateTime.now());
        enrollmentPayment.setIsDeleted(false);
        return enrollmentPaymentJPARepository.save(enrollmentPayment);
    }

    @Override
    public EnrollmentPayment update(EnrollmentPayment enrollmentPayment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        enrollmentPayment.setLastModifiedBy(currentUser);
        enrollmentPayment.setLastModifiedOn(LocalDateTime.now());
        return enrollmentPaymentJPARepository.save(enrollmentPayment);
    }

    @Override
    public Optional<EnrollmentPayment> selectById(Integer id) {
        return enrollmentPaymentJPARepository.findById(id);
    }

    @Override
    public List<EnrollmentPayment> selectAllByFilters(EnrollmentPaymentSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(EnrollmentPaymentSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}