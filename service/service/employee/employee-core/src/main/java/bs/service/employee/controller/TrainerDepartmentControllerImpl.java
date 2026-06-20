package bs.service.employee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.TrainerDepartmentService;
import bs.service.employee.controller.generated.TrainerDepartmentController;
import bs.service.employee.model.generated.AssignDepartmentDTO;
import bs.service.employee.model.generated.TrainerDepartmentResultSet;
import bs.service.employee.model.generated.TrainerDepartmentVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class TrainerDepartmentControllerImpl implements TrainerDepartmentController {

    private final TrainerDepartmentService trainerDepartmentService;


    @Override
    public ResponseEntity<List<NewRecordVTO>> _assignDepartmentToTrainer(Integer trainerId, AssignDepartmentDTO assignDepartmentDTO) {
        return ResponseEntity.ok(trainerDepartmentService.assignDepartmentToTrainer(trainerId, assignDepartmentDTO));
    }

    @Override
    public ResponseEntity<TrainerDepartmentVTO> _getTrainerDepartmentById(Integer trainerDepartmentId) {
        return ResponseEntity.ok(trainerDepartmentService.getTrainerDepartmentById(trainerDepartmentId));
    }

    @Override
    public ResponseEntity<TrainerDepartmentResultSet> _getTrainerDepartments(Integer trainerId, Integer departmentId, String quickSearch, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(trainerDepartmentService.getAllTrainerDepartmentsByFilters(trainerId, departmentId, quickSearch, pageNum, pageSize, orderDir, orderBy));
    }


    @Override
    public ResponseEntity<Void> _unassignDepartmentFromTrainer(Integer trainerDepartmentId) {
        trainerDepartmentService.deleteTrainerDepartmentById(trainerDepartmentId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<Void> _updateTrainerDepartment(Integer trainerDepartmentId, AssignDepartmentDTO assignDepartmentDTO) {
        trainerDepartmentService.updateTrainerDepartment(trainerDepartmentId, assignDepartmentDTO);
        return ResponseEntity.noContent().build();
    }
}
