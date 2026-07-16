package bs.service.enrollment.api.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.enrollment.model.generated.EnrollmentDTO;
import bs.service.enrollment.model.generated.EnrollmentResultSet;
import bs.service.enrollment.model.generated.EnrollmentVTO;

import java.time.LocalDate;

public interface EnrollmentService {
    NewRecordVTO createEnrollment(EnrollmentDTO enrollmentDTO);
    NewRecordVTO updateEnrollment(Integer enrollmentId, EnrollmentDTO enrollmentDTO);
    void deleteEnrollment(Integer enrollmentId);
    EnrollmentVTO getEnrollmentById(Integer enrollmentId);
    EnrollmentResultSet getAllEnrollmentsByFilter(String quickSearch, Boolean isActive,Boolean isAutoUpdate,
                                                  Integer traineeId,String traineeNationalId, Integer courseId,Integer trainerId,
                                                  Integer enrollmentTypeId, EnrollmentStatus enrollmentStatus,
                                                  PaymentStatus paymentStatus, LocalDate startDateFrom,
                                                  LocalDate startDateTo, LocalDate endDateFrom,
                                                  LocalDate endDateTo, LocalDate createdOnFrom,
                                                  LocalDate createdOnTo, Integer pageNum, Integer pageSize,
                                                  OrderDirections orderDir, String orderBy);

    LookupResultSet getAllEnrollmentsLookup();

    void updateEnrollmentsActivation();
}