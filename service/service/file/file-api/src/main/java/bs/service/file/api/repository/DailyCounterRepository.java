package bs.service.file.api.repository;

import bs.service.file.model.entity.FlDailyCounter;

import java.util.Optional;

public interface DailyCounterRepository {
    Optional<FlDailyCounter> selectById(Integer id);

    FlDailyCounter update(FlDailyCounter counterEntity);
}
