package bs.service.trainee.repository.jpa;

import bs.service.trainee.model.entity.Trainee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TraineeJPARepository extends JpaRepository<Trainee, Integer> {
}