package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.PaymentMethodRepository;
import bs.service.financial.model.entity.PaymentMethod;
import bs.service.financial.model.filter.PaymentMethodSearchFilter;
import bs.service.financial.repository.jpa.PaymentMethodJPARepository;
import bs.service.financial.repository.query.PaymentMethodQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class PaymentMethodRepositoryImpl implements PaymentMethodRepository {

    private final PaymentMethodJPARepository paymentMethodJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final PaymentMethodQueryBuilder queryBuilder;

    @Override
    public PaymentMethod insert(PaymentMethod paymentMethod) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        paymentMethod.setCreatedBy(currentUser);
        paymentMethod.setCreatedOn(LocalDateTime.now());
        return paymentMethodJPARepository.save(paymentMethod);
    }

    @Override
    public PaymentMethod update(PaymentMethod paymentMethod) {
        return paymentMethodJPARepository.save(paymentMethod);
    }

    @Override
    public Optional<PaymentMethod> selectById(Integer id) {
        return paymentMethodJPARepository.findById(id);
    }

    @Override
    public List<PaymentMethod> selectAllByFilters(PaymentMethodSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(PaymentMethodSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}