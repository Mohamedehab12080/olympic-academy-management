package bs.lib.id.counter.repository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.lib.id.counter.api.repository.CounterInstanceAttributeRepository;
import bs.lib.id.counter.repository.jpa.CounterInstanceAttributeJPARepository;
import bs.lib.id.counter.model.entity.CounterInstanceAttribute;

@Repository
@AllArgsConstructor
public class CounterInstanceAttributeRepositoryImpl implements CounterInstanceAttributeRepository {

    private final CounterInstanceAttributeJPARepository counterInstanceAttributeJPARepository;

    @Override
    public CounterInstanceAttribute insert(CounterInstanceAttribute entity) {
        return counterInstanceAttributeJPARepository.save(entity);
    }
}
