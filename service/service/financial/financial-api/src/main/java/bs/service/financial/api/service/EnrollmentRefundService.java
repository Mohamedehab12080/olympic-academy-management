package bs.service.financial.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.enums.RefundStatus;
import bs.service.financial.model.generated.EnrollmentRefundDTO;
import bs.service.financial.model.generated.EnrollmentRefundResultSet;
import bs.service.financial.model.generated.EnrollmentRefundVTO;

import java.time.LocalDate;

public interface EnrollmentRefundService {
    NewRecordVTO createEnrollmentRefund(EnrollmentRefundDTO enrollmentRefundDTO);
    NewRecordVTO updateEnrollmentRefund(Integer refundId, EnrollmentRefundDTO enrollmentRefundDTO);
    void deleteEnrollmentRefund(Integer refundId);
    EnrollmentRefundVTO getEnrollmentRefundById(Integer refundId);
    EnrollmentRefundResultSet getAllEnrollmentRefundsByFilter(Integer enrollmentId, Integer paymentMethodId,
                                                              RefundStatus status, LocalDate refundDateFrom,
                                                              LocalDate refundDateTo, Integer pageNum,
                                                              Integer pageSize, OrderDirections orderDir,
                                                              String orderBy);
}