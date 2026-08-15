package bs.service.trainee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.service.trainee.model.generated.TraineeDTO;
import bs.service.trainee.model.generated.TraineeVTO;

public interface TraineeUserService {

    NewRecordVTO createTraineeUser(Integer traineeUserId, TraineeDTO traineeDTO);

    TraineeVTO getTraineeUserById(Integer traineeUserId);

    NewRecordVTO updateTraineeUser(Integer traineeUserId, TraineeDTO traineeDTO);
}
