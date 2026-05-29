package bs.lib.id.counter.repository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.lib.id.counter.api.repository.CounterRepository;
import bs.lib.id.counter.model.entity.Counter;
import bs.lib.id.counter.repository.jpa.CounterJPARepository;

import java.util.Optional;

@Repository
@AllArgsConstructor
public class CounterRepositoryImpl implements CounterRepository {

    private final CounterJPARepository counterJPARepository;

    @Override
    public Optional<Counter> selectById(Integer id) {
        return counterJPARepository.findById(id);
    }
}
