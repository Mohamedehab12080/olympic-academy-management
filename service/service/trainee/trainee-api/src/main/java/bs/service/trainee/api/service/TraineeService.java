package bs.service.trainee.api.service;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.model.generated.*;

import java.time.LocalDate;

public interface TraineeService {
    // Trainee CRUD
    NewRecordVTO createTrainee(TraineeDTO traineeDTO);
    NewRecordVTO updateTrainee(Integer traineeId, TraineeDTO traineeDTO);
    void deleteTraineeById(Integer traineeId);
    TraineeVTO getTraineeById(Integer traineeId);
    TraineeResultSet getAllTraineesByFilter(String quickSearch, Gender gender, String academicYear,
                                            LocalDate createdOnFrom, LocalDate createdOnTo,
                                            Integer pageNum, Integer pageSize,
                                            OrderDirections orderDir, String orderBy);

    // Health Condition CRUD
    NewRecordVTO createHealthCondition(Integer traineeId, HealthConditionDTO healthConditionDTO);
    NewRecordVTO updateHealthCondition(Integer traineeId, Integer conditionId, HealthConditionDTO healthConditionDTO);
    void deleteHealthCondition(Integer traineeId, Integer conditionId);
    HealthConditionResultSet getHealthConditions(Integer traineeId);
}