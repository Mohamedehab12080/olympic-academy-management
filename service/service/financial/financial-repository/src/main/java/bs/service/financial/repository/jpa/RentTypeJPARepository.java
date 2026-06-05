package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.place.RentType;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentTypeJPARepository extends JpaRepository<RentType, Integer> {
}