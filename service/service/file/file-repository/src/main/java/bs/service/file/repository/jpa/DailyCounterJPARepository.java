package bs.service.file.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import bs.service.file.model.entity.FlDailyCounter;

@Repository
public interface DailyCounterJPARepository extends JpaRepository<FlDailyCounter, Integer> {
}
