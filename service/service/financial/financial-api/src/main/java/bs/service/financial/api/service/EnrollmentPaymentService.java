package bs.service.financial.api.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.EnrollmentPaymentDTO;
import bs.service.financial.model.generated.EnrollmentPaymentResultSet;
import bs.service.financial.model.generated.EnrollmentPaymentVTO;

import java.time.LocalDate;

public interface EnrollmentPaymentService {
    NewRecordVTO createEnrollmentPayment(EnrollmentPaymentDTO enrollmentPaymentDTO);
    NewRecordVTO updateEnrollmentPayment(Integer paymentId, EnrollmentPaymentDTO enrollmentPaymentDTO);
    void deleteEnrollmentPayment(Integer paymentId);
    EnrollmentPaymentVTO getEnrollmentPaymentById(Integer paymentId);
    EnrollmentPaymentResultSet getAllEnrollmentPaymentsByFilter(Integer enrollmentId,Integer courseId, Integer paymentMethodId,
                                                                PaymentStatus status, LocalDate paymentDateFrom,
                                                                LocalDate paymentDateTo, Integer pageNum,
                                                                Integer pageSize, OrderDirections orderDir,
                                                                String orderBy);
}