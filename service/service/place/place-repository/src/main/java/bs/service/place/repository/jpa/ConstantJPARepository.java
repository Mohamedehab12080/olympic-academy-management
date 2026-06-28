package bs.service.place.repository.jpa;

import bs.service.place.model.entity.Constant;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConstantJPARepository extends JpaRepository<Constant, Integer> {
}
