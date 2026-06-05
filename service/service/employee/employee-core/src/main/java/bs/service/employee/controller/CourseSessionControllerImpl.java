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
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalTime;

@RestController
@AllArgsConstructor
public class CourseSessionControllerImpl implements CourseSessionController {

    private final CourseSessionService courseSessionService;

    @Override
    public ResponseEntity<NewRecordVTO> _createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO) {
        NewRecordVTO result = courseSessionService.createCourseSession(courseId, courseSessionDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteCourseSession(Integer courseId, Integer sessionId) {
        courseSessionService.deleteCourseSession(courseId, sessionId);
        return ResponseEntity.ok().build();
    }


    @Override
    public ResponseEntity<CourseSessionResultSet> _getAllCourseSessionsByFilter(Integer courseId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        CourseSessionResultSet result = courseSessionService.getAllCourseSessionsByFilter(
                courseId, status, sessionDateFrom, sessionDateTo,
                startTimeFrom, startTimeTo, endTimeFrom, endTimeTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<CourseSessionResultSet> _getAllSessionsByFilter(Integer courseId, Integer trainerId, Integer placeId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy){

        CourseSessionResultSet result = courseSessionService.getAllSessionsByFilter(
                courseId, trainerId, placeId, status,
                sessionDateFrom, sessionDateTo, startTimeFrom, startTimeTo,
                endTimeFrom, endTimeTo, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<CourseSessionVTO> _getCourseSessionById(Integer courseId, Integer sessionId) {
        CourseSessionVTO result = courseSessionService.getCourseSessionById(courseId, sessionId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateCourseSession(Integer courseId, Integer sessionId,
                                                             CourseSessionDTO courseSessionDTO) {
        NewRecordVTO result = courseSessionService.updateCourseSession(courseId, sessionId, courseSessionDTO);
        return ResponseEntity.ok(result);
    }
}