package bs.service.financial.controller;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.EnrollmentPaymentService;
import bs.service.financial.controller.generated.EnrollmentPaymentController;
import bs.service.financial.model.generated.EnrollmentPaymentDTO;
import bs.service.financial.model.generated.EnrollmentPaymentResultSet;
import bs.service.financial.model.generated.EnrollmentPaymentVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class EnrollmentPaymentControllerImpl implements EnrollmentPaymentController {

    private final EnrollmentPaymentService enrollmentPaymentService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createEnrollmentPayment(EnrollmentPaymentDTO enrollmentPaymentDTO) {
        NewRecordVTO result = enrollmentPaymentService.createEnrollmentPayment(enrollmentPaymentDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteEnrollmentPayment(Integer paymentId) {
        enrollmentPaymentService.deleteEnrollmentPayment(paymentId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EnrollmentPaymentResultSet> _getAllEnrollmentPaymentsByFilter(String traineeNationalId,
            Integer enrollmentId,Integer courseId, Integer paymentMethodId, PaymentStatus status,
            LocalDate paymentDateFrom, LocalDate paymentDateTo,String quickSearch,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        EnrollmentPaymentResultSet result = enrollmentPaymentService.getAllEnrollmentPaymentsByFilter(
                traineeNationalId,enrollmentId,courseId, paymentMethodId, status, paymentDateFrom, paymentDateTo,quickSearch,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EnrollmentPaymentVTO> _getEnrollmentPaymentById(Integer paymentId) {
        EnrollmentPaymentVTO result = enrollmentPaymentService.getEnrollmentPaymentById(paymentId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateEnrollmentPayment(Integer paymentId, EnrollmentPaymentDTO enrollmentPaymentDTO) {
        NewRecordVTO result = enrollmentPaymentService.updateEnrollmentPayment(paymentId, enrollmentPaymentDTO);
        return ResponseEntity.ok(result);
    }
}