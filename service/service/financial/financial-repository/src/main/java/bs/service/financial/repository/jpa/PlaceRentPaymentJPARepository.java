package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.place.PlaceRentPayment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceRentPaymentJPARepository extends JpaRepository<PlaceRentPayment, Integer> {
}