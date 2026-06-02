package bs.service.trainee.api.repository;

import bs.service.trainee.model.entity.HealthCondition;
import bs.service.trainee.model.filter.HealthConditionSearchFilter;

import java.util.List;
import java.util.Optional;

public interface HealthConditionRepository {
    HealthCondition insert(HealthCondition healthCondition);

    HealthCondition update(HealthCondition healthCondition);

    Optional<HealthCondition> selectById(Integer id);

    List<HealthCondition> selectAllByFilters(HealthConditionSearchFilter filters);

    Integer countAllByFilters(HealthConditionSearchFilter filters);

    void deleteById(Integer healthConditionId);
}
