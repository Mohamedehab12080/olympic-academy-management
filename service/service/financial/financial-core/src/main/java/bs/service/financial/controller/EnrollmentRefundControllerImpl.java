package bs.service.financial.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.EnrollmentRefundService;
import bs.service.financial.controller.generated.EnrollmentRefundController;
import bs.service.financial.model.enums.RefundStatus;
import bs.service.financial.model.generated.EnrollmentRefundDTO;
import bs.service.financial.model.generated.EnrollmentRefundResultSet;
import bs.service.financial.model.generated.EnrollmentRefundVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class EnrollmentRefundControllerImpl implements EnrollmentRefundController {

    private final EnrollmentRefundService enrollmentRefundService;

    @Override
    public ResponseEntity<NewRecordVTO> _createEnrollmentRefund(EnrollmentRefundDTO enrollmentRefundDTO) {
        NewRecordVTO result = enrollmentRefundService.createEnrollmentRefund(enrollmentRefundDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteEnrollmentRefund(Integer refundId) {
        enrollmentRefundService.deleteEnrollmentRefund(refundId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<EnrollmentRefundResultSet> _getAllEnrollmentRefundsByFilter(
            Integer enrollmentId,
            Integer paymentMethodId,
            RefundStatus status,
            LocalDate refundDateFrom,
            LocalDate refundDateTo,
            Integer pageNum,
            Integer pageSize,
            OrderDirections orderDir,
            String orderBy) {

        EnrollmentRefundResultSet result = enrollmentRefundService.getAllEnrollmentRefundsByFilter(
                enrollmentId,
                paymentMethodId,
                status,
                refundDateFrom,
                refundDateTo,
                pageNum,
                pageSize,
                orderDir,
                orderBy
        );
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<EnrollmentRefundVTO> _getEnrollmentRefundById(Integer refundId) {
        EnrollmentRefundVTO result = enrollmentRefundService.getEnrollmentRefundById(refundId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateEnrollmentRefund(Integer refundId, EnrollmentRefundDTO enrollmentRefundDTO) {
        NewRecordVTO result = enrollmentRefundService.updateEnrollmentRefund(refundId, enrollmentRefundDTO);
        return ResponseEntity.ok(result);
    }
}