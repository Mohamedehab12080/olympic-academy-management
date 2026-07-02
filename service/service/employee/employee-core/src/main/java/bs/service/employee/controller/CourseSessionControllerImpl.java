package bs.service.employee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.CourseSessionService;
import bs.service.employee.controller.generated.CourseSessionController;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.generated.CourseSessionDTO;
import bs.service.employee.model.generated.CourseSessionResultSet;
import bs.service.employee.model.generated.CourseSessionVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@AllArgsConstructor
public class CourseSessionControllerImpl implements CourseSessionController {

    private final CourseSessionService courseSessionService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<List<NewRecordVTO>> _createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO) {
        List<NewRecordVTO> result = courseSessionService.createCourseSession(courseId, courseSessionDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteCourseSession(Integer courseSessionId) {
        courseSessionService.deleteCourseSession(courseSessionId);
        return ResponseEntity.ok().build();
    }


    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<CourseSessionResultSet> _getAllCourseSessionsByFilter(Integer courseId,List<Integer> trainerIds ,String sessionDay, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        CourseSessionResultSet result = courseSessionService.getAllCourseSessionsByFilter(
                courseId,trainerIds,sessionDay, status, sessionDateFrom, sessionDateTo,
                startTimeFrom, startTimeTo, endTimeFrom, endTimeTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<CourseSessionResultSet> _getAllSessionsByFilter(Integer courseId,String sessionDay, Integer trainerId,List<Integer> trainerIds , Integer placeId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy){

        CourseSessionResultSet result = courseSessionService.getAllSessionsByFilter(
                courseId,trainerIds,sessionDay, trainerId, placeId, status,
                sessionDateFrom, sessionDateTo, startTimeFrom, startTimeTo,
                endTimeFrom, endTimeTo, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<CourseSessionVTO> _getCourseSessionById(Integer courseSessionId) {
        CourseSessionVTO result = courseSessionService.getCourseSessionById(courseSessionId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<List<NewRecordVTO>> _updateCourseSession(CourseSessionDTO courseSessionDTO) {
        List<NewRecordVTO> result = courseSessionService.updateCourseSession( courseSessionDTO);
        return ResponseEntity.ok(result);
    }
}