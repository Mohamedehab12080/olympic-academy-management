package bs.service.trainee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.service.TraineeAttendanceService;
import bs.service.trainee.controller.generated.TraineeAttendanceController;
import bs.service.trainee.model.enums.TraineeAttendanceStatus;
import bs.service.trainee.model.generated.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class TraineeAttendanceControllerImpl implements TraineeAttendanceController {

    private final TraineeAttendanceService traineeAttendanceService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<List<NewRecordVTO>> _batchCreateTraineeAttendance(List<TraineeAttendanceDTO> traineeAttendanceDTO) {
        log.info("POST /trainee-attendances/batch - Batch creating {} trainee attendances", traineeAttendanceDTO.size());

        List<NewRecordVTO> results = traineeAttendanceService.batchCreateTraineeAttendances(traineeAttendanceDTO);

        return new ResponseEntity<>(results, HttpStatus.CREATED);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createTraineeAttendance(TraineeAttendanceDTO traineeAttendanceDTO) {
        log.info("POST /trainee-attendances - Creating trainee attendance for traineeId: {}, sessionId: {}",
                traineeAttendanceDTO.getTraineeId(), traineeAttendanceDTO.getCourseSessionId());

        NewRecordVTO result = traineeAttendanceService.createTraineeAttendance(traineeAttendanceDTO);

        return new ResponseEntity<>(result, HttpStatus.CREATED);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteTraineeAttendance(Integer attendanceId) {
        log.info("DELETE /trainee-attendances/{} - Deleting trainee attendance", attendanceId);

        traineeAttendanceService.deleteTraineeAttendanceById(attendanceId);

        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<TraineeAttendanceResultSet> _getAllTraineeAttendances(Integer traineeId, Integer courseId, Integer courseSessionId, TraineeAttendanceStatus status, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, LocalDate fromDate, LocalDate toDate, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        log.info("GET /trainee-attendances - Getting all trainee attendances with filters");

        TraineeAttendanceResultSet result = traineeAttendanceService.getAllTraineeAttendances(
                traineeId,
                courseId,
                courseSessionId,
                status,
                checkInFrom,
                checkInTo,
                checkOutFrom,
                checkOutTo,
                fromDate,
                toDate,
                pageNum,
                pageSize,
                orderDir,
                orderBy
        );

        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<DailyAttendanceReport> _getDailyTraineeAttendanceReport(LocalDate attendanceDate) {
        log.info("GET /attendances/reports/daily - Getting daily attendance report for date: {}", attendanceDate);

        DailyAttendanceReport report = traineeAttendanceService.getDailyAttendanceReport(attendanceDate);

        return ResponseEntity.ok(report);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<SessionAttendanceReport> _getSessionAttendanceReport(Integer sessionId) {
        log.info("GET /trainee-attendances/session/{}/report - Getting session attendance report", sessionId);

        SessionAttendanceReport report = traineeAttendanceService.getSessionAttendanceReport(sessionId);

        return ResponseEntity.ok(report);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<TraineeAttendanceVTO> _getTraineeAttendanceById(Integer attendanceId) {
        log.info("GET /trainee-attendances/{} - Getting trainee attendance by id", attendanceId);

        TraineeAttendanceVTO result = traineeAttendanceService.getTraineeAttendanceById(attendanceId);

        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateTraineeAttendance(Integer attendanceId, TraineeAttendanceDTO traineeAttendanceDTO) {
        log.info("PUT /trainee-attendances/{} - Updating trainee attendance", attendanceId);

        NewRecordVTO result = traineeAttendanceService.updateTraineeAttendance(attendanceId, traineeAttendanceDTO);

        return ResponseEntity.ok(result);
    }
}