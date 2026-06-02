package bs.service.trainee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.service.trainee.model.generated.TraineeContactDTO;
import bs.service.trainee.model.generated.TraineeContactResultSet;

public interface TraineeContactService {

    NewRecordVTO createTraineeContact(Integer traineeId, TraineeContactDTO traineeContactDTO);
    NewRecordVTO updateTraineeContact(Integer traineeId, Integer contactId, TraineeContactDTO traineeContactDTO);
    void deleteTraineeContact(Integer traineeId, Integer contactId);
    TraineeContactResultSet getTraineeContacts(Integer traineeId,String contactValue);
}
