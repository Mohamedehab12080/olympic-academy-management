package bs.service.enrollment.controller;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.api.service.EnrollmentService;
import bs.service.enrollment.controller.generated.EnrollmentController;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.enrollment.model.generated.EnrollmentDTO;
import bs.service.enrollment.model.generated.EnrollmentResultSet;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class EnrollmentControllerImpl implements EnrollmentController {

    private final EnrollmentService enrollmentService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createEnrollment(EnrollmentDTO enrollmentDTO) {
        NewRecordVTO result = enrollmentService.createEnrollment(enrollmentDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteEnrollment(Integer enrollmentId) {
        enrollmentService.deleteEnrollment(enrollmentId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EnrollmentResultSet> _getAllEnrollmentsByFilter(String quickSearch, Boolean isActive, Integer traineeId, Integer courseId, Integer trainerId, Integer enrollmentTypeId, EnrollmentStatus enrollmentStatus, PaymentStatus paymentStatus, LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo, LocalDate createdOnFrom, LocalDate createdOnTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        EnrollmentResultSet result = enrollmentService.getAllEnrollmentsByFilter(
                quickSearch, isActive, traineeId, courseId, trainerId, enrollmentTypeId,
                enrollmentStatus, paymentStatus, startDateFrom, startDateTo,
                endDateFrom, endDateTo, createdOnFrom, createdOnTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EnrollmentVTO> _getEnrollmentById(Integer enrollmentId) {
        EnrollmentVTO result = enrollmentService.getEnrollmentById(enrollmentId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateEnrollment(Integer enrollmentId, EnrollmentDTO enrollmentDTO) {
        NewRecordVTO result = enrollmentService.updateEnrollment(enrollmentId, enrollmentDTO);
        return ResponseEntity.ok(result);
    }
}