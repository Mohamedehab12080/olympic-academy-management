package bs.service.file.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.service.file.api.repository.DailyCounterRepository;
import bs.service.file.model.entity.FlDailyCounter;
import bs.service.file.repository.jpa.DailyCounterJPARepository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class DailyCounterRepositoryImpl implements DailyCounterRepository {

    private final DailyCounterJPARepository dailyCounterJPARepository;

    @Override
    public Optional<FlDailyCounter> selectById(Integer id) {
        return dailyCounterJPARepository.findById(id);
    }

    @Override
    public FlDailyCounter update(FlDailyCounter counterEntity) {
        return dailyCounterJPARepository.save(counterEntity);
    }

}
