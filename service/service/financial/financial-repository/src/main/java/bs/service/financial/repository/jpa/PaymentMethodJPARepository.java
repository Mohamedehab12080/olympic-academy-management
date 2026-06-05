package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.PaymentMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface PaymentMethodJPARepository extends JpaRepository<PaymentMethod, Integer> {
}