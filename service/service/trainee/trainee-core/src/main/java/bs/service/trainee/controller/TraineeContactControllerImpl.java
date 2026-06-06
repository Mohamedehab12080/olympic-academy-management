package bs.service.trainee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.service.trainee.api.service.TraineeContactService;
import bs.service.trainee.controller.generated.TraineeContactController;
import bs.service.trainee.model.generated.TraineeContactDTO;
import bs.service.trainee.model.generated.TraineeContactResultSet;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class TraineeContactControllerImpl implements TraineeContactController {

    private final TraineeContactService traineeContactService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createTraineeContact(Integer traineeId, TraineeContactDTO traineeContactDTO) {
        NewRecordVTO result = traineeContactService.createTraineeContact(traineeId, traineeContactDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteTraineeContact(Integer traineeId, Integer contactId) {
        traineeContactService.deleteTraineeContact(traineeId, contactId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<TraineeContactResultSet> _getTraineeContacts(Integer traineeId,String contactValue) {
        TraineeContactResultSet result = traineeContactService.getTraineeContacts(traineeId,contactValue);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateTraineeContact(Integer traineeId, Integer contactId,
                                                              TraineeContactDTO traineeContactDTO) {
        NewRecordVTO result = traineeContactService.updateTraineeContact(traineeId, contactId, traineeContactDTO);
        return ResponseEntity.ok(result);
    }
}