package bs.service.employee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.TrainerCourseService;
import bs.service.employee.controller.generated.TrainerCourseController;
import bs.service.employee.model.generated.AssignCourseDTO;
import bs.service.employee.model.generated.TrainerCourseAssignmentResultSet;
import bs.service.employee.model.generated.TrainerCourseResultSet;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class TrainerCourseControllerImpl implements TrainerCourseController {

    private final TrainerCourseService trainerCourseService;

    @Override
    public ResponseEntity<TrainerCourseResultSet> _getTrainerCourses(Integer trainerId, Integer pageNum,
                                                                     Integer pageSize, OrderDirections orderDir,
                                                                     String orderBy) {
        TrainerCourseResultSet result = trainerCourseService.getTrainerCoursesByFilter(
                trainerId, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _assignCourseToTrainer(Integer trainerId, AssignCourseDTO assignCourseDTO) {
        NewRecordVTO result = trainerCourseService.assignCourseToTrainer(trainerId, assignCourseDTO.getCourseId());
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _unassignCourseFromTrainer(Integer trainerId, Integer courseId) {
        trainerCourseService.unassignCourseFromTrainer(trainerId, courseId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<TrainerCourseAssignmentResultSet> _getAllTrainerCourseAssignments(
            Integer trainerId, Integer courseId, Integer pageNum, Integer pageSize,
            OrderDirections orderDir, String orderBy) {

        TrainerCourseAssignmentResultSet result = trainerCourseService.getAllTrainerCourseAssignmentsByFilter(
                trainerId, courseId, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }
}