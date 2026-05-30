package bs.lib.id.counter.api.repository;

import bs.lib.id.counter.model.entity.Counter;

import java.util.Optional;

public interface CounterRepository {
    Optional<Counter> selectById(Integer id);
}
