package bs.service.financial.api.repository;

import bs.service.financial.model.entity.PaymentMethod;
import bs.service.financial.model.filter.PaymentMethodSearchFilter;

import java.util.List;
import java.util.Optional;

public interface PaymentMethodRepository {
    PaymentMethod insert(PaymentMethod paymentMethod);
    PaymentMethod update(PaymentMethod paymentMethod);
    Optional<PaymentMethod> selectById(Integer id);
    List<PaymentMethod> selectAllByFilters(PaymentMethodSearchFilter filters);
    Integer countAllByFilters(PaymentMethodSearchFilter filters);
    void deleteById(Integer id);
}