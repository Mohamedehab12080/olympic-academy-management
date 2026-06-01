package bs.lib.id.counter.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import bs.lib.id.counter.model.entity.CounterInstanceAttribute;

@Repository
public interface CounterInstanceAttributeJPARepository extends JpaRepository<CounterInstanceAttribute,Integer> {
}
