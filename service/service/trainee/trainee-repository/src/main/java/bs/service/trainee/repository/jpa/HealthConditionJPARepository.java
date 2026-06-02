package bs.service.trainee.repository.jpa;

import bs.service.trainee.model.entity.HealthCondition;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthConditionJPARepository extends JpaRepository<HealthCondition, Integer> {
}