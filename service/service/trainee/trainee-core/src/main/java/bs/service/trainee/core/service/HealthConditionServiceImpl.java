package bs.service.trainee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.repository.HealthConditionRepository;
import bs.service.trainee.api.repository.TraineeRepository;
import bs.service.trainee.api.service.HealthConditionService;
import bs.service.trainee.core.mapper.TraineeMapper;
import bs.service.trainee.model.entity.HealthCondition;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.filter.HealthConditionSearchFilter;
import bs.service.trainee.model.generated.HealthConditionDTO;
import bs.service.trainee.model.generated.HealthConditionResultSet;
import bs.service.trainee.model.generated.HealthConditionVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.trainee.model.enums.TraineeErrors.HEALTH_CONDITION_NOT_FOUND;
import static bs.service.trainee.model.enums.TraineeErrors.TRAINEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class HealthConditionServiceImpl implements HealthConditionService {

    private final HealthConditionRepository healthConditionRepository;
    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;

    @Override
    @Transactional
    public NewRecordVTO createHealthCondition(Integer traineeId, HealthConditionDTO healthConditionDTO) {
        Trainee trainee = traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        HealthCondition condition = traineeMapper.toHealthCondition(healthConditionDTO);
        condition.setTrainee(trainee);
        condition = healthConditionRepository.insert(condition);

        return NewRecordVTO.builder().id(condition.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateHealthCondition(Integer traineeId, Integer conditionId, HealthConditionDTO healthConditionDTO) {
        traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        HealthCondition condition = healthConditionRepository.selectById(conditionId)
                .orElseThrow(() -> new BusinessException(HEALTH_CONDITION_NOT_FOUND, conditionId));

        HealthCondition conditionToUpdate = traineeMapper.toHealthCondition(healthConditionDTO);
        conditionToUpdate.setId(conditionId);
        conditionToUpdate.setTrainee(condition.getTrainee());
        healthConditionRepository.update(conditionToUpdate);

        return NewRecordVTO.builder().id(conditionId).build();
    }

    @Override
    @Transactional
    public void deleteHealthCondition(Integer traineeId, Integer conditionId) {
        traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        HealthCondition condition = healthConditionRepository.selectById(conditionId)
                .orElseThrow(() -> new BusinessException(HEALTH_CONDITION_NOT_FOUND, conditionId));

        healthConditionRepository.deleteById(condition.getId());
    }

    @Override
    public HealthConditionResultSet getAllHealthConditionsByFilter(Integer traineeId, String quickSearch,
                                                                   String medication, Integer pageNum,
                                                                   Integer pageSize, OrderDirections orderDir,
                                                                   String orderBy) {
        HealthConditionSearchFilter filter = HealthConditionSearchFilter.builder()
                .traineeId(traineeId)
                .quickSearchQuery(quickSearch)
                .medication(medication)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(HealthConditionSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<HealthCondition> conditions = healthConditionRepository.selectAllByFilters(filter);
        List<HealthConditionVTO> items = traineeMapper.toHealthConditionVTOs(conditions);

        return HealthConditionResultSet.builder()
                .items(items)
                .total(healthConditionRepository.countAllByFilters(filter))
                .build();
    }
}