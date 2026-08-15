package bs.service.trainee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.service.trainee.api.service.TraineeUserService;
import bs.service.trainee.controller.generated.TraineeUserController;
import bs.service.trainee.model.generated.TraineeDTO;
import bs.service.trainee.model.generated.TraineeVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TraineeUserControllerImpl implements TraineeUserController {

    private final TraineeUserService traineeUserService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN","ROLE_TRAINEE"})
    public ResponseEntity<NewRecordVTO> _createTraineeUser(Integer traineeUserId, TraineeDTO traineeDTO) {
        return ResponseEntity.ok(traineeUserService.createTraineeUser(traineeUserId, traineeDTO));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN","ROLE_TRAINEE"})
    public ResponseEntity<TraineeVTO> _getTraineeUserById(Integer traineeUserId) {
        return ResponseEntity.ok(traineeUserService.getTraineeUserById(traineeUserId));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN","ROLE_TRAINEE"})
    public ResponseEntity<NewRecordVTO> _updateTraineeUser(Integer traineeUserId, TraineeDTO traineeDTO) {
        return ResponseEntity.ok(traineeUserService.updateTraineeUser(traineeUserId, traineeDTO));
    }
}
