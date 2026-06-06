package bs.service.trainee.controller;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.service.TraineeService;
import bs.service.trainee.controller.generated.TraineeController;
import bs.service.trainee.model.generated.TraineeDTO;
import bs.service.trainee.model.generated.TraineeResultSet;
import bs.service.trainee.model.generated.TraineeVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class TraineeControllerImpl implements TraineeController {

    private final TraineeService traineeService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createTrainee(TraineeDTO traineeDTO) {
        NewRecordVTO result = traineeService.createTrainee(traineeDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteTraineeById(Integer traineeId) {
        traineeService.deleteTraineeById(traineeId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<TraineeResultSet> _getAllTraineesByFilter(String quickSearch, Boolean isActive,
                                                                    Gender gender, String academicYear,
                                                                    LocalDate createdOnFrom, LocalDate createdOnTo,
                                                                    Integer pageNum, Integer pageSize,
                                                                    OrderDirections orderDir, String orderBy) {
        TraineeResultSet result = traineeService.getAllTraineesByFilter(
                quickSearch, isActive, gender, academicYear,
                createdOnFrom, createdOnTo, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<TraineeVTO> _getTraineeById(Integer traineeId) {
        TraineeVTO result = traineeService.getTraineeById(traineeId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateTrainee(Integer traineeId, TraineeDTO traineeDTO) {
        NewRecordVTO result = traineeService.updateTrainee(traineeId, traineeDTO);
        return ResponseEntity.ok(result);
    }
}