package bs.lib.id.counter.api.repository;

import bs.lib.id.counter.model.entity.CounterInstance;
import bs.lib.id.counter.model.entity.CounterInstanceAttribute;

import java.util.List;
import java.util.Optional;

public interface CounterInstanceRepository {

    CounterInstance insert(CounterInstance entity);

    void update(CounterInstance entity);

    Optional<CounterInstance> selectByFilters(Integer counterId, List<CounterInstanceAttribute> attributes);
}
