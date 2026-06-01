package bs.service.trainee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.model.generated.HealthConditionDTO;
import bs.service.trainee.model.generated.HealthConditionResultSet;

public interface HealthConditionService {
    NewRecordVTO createHealthCondition(Integer traineeId, HealthConditionDTO healthConditionDTO);
    NewRecordVTO updateHealthCondition(Integer traineeId, Integer conditionId, HealthConditionDTO healthConditionDTO);
    void deleteHealthCondition(Integer traineeId, Integer conditionId);
    HealthConditionResultSet getAllHealthConditionsByFilter(Integer traineeId, String quickSearch, String medication, Integer pageNum, Integer pageSize, OrderDirections orderDir,String orderBy);
}
