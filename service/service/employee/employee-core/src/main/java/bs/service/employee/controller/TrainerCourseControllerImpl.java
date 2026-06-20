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
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class TrainerCourseControllerImpl implements TrainerCourseController {

    private final TrainerCourseService trainerCourseService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<TrainerCourseResultSet> _getTrainerCourses(Integer trainerId, Integer courseId, String quickSearch, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        TrainerCourseResultSet result = trainerCourseService.getTrainerCoursesByFilter(
                quickSearch,trainerId, courseId, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _assignCourseToTrainer(Integer trainerId, AssignCourseDTO assignCourseDTO) {
        NewRecordVTO result = trainerCourseService.assignCourseToTrainer(trainerId, assignCourseDTO.getCourseId());
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _unassignCourseFromTrainer(Integer trainerId, Integer courseId) {
        trainerCourseService.unassignCourseFromTrainer(trainerId, courseId);
        return ResponseEntity.ok().build();
    }
}