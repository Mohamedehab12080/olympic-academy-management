package bs.service.trainee.repository.jpa;

import bs.service.trainee.model.entity.TraineeContact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TraineeContactJPARepository extends JpaRepository<TraineeContact, Integer> {
}