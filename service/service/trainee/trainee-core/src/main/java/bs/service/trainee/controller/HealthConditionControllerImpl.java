package bs.service.trainee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.service.HealthConditionService;
import bs.service.trainee.controller.generated.HealthConditionController;
import bs.service.trainee.model.generated.HealthConditionDTO;
import bs.service.trainee.model.generated.HealthConditionResultSet;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class HealthConditionControllerImpl implements HealthConditionController {

    private final HealthConditionService healthConditionService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createHealthCondition(Integer traineeId, HealthConditionDTO healthConditionDTO) {
        NewRecordVTO result = healthConditionService.createHealthCondition(traineeId, healthConditionDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteHealthCondition(Integer traineeId, Integer conditionId) {
        healthConditionService.deleteHealthCondition(traineeId, conditionId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<HealthConditionResultSet> _getAllHealthConditionsByFilter(
            Integer traineeId, String quickSearch, String medication,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        HealthConditionResultSet result = healthConditionService.getAllHealthConditionsByFilter(
                traineeId, quickSearch, medication, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateHealthCondition(Integer traineeId, Integer conditionId,
                                                               HealthConditionDTO healthConditionDTO) {
        NewRecordVTO result = healthConditionService.updateHealthCondition(traineeId, conditionId, healthConditionDTO);
        return ResponseEntity.ok(result);
    }
}