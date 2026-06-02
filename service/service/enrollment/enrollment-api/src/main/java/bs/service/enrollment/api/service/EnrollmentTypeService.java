package bs.service.enrollment.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.model.generated.EnrollmentTypeDTO;
import bs.service.enrollment.model.generated.EnrollmentTypeResultSet;
import bs.service.enrollment.model.generated.EnrollmentTypeVTO;

public interface EnrollmentTypeService {
    NewRecordVTO createEnrollmentType(EnrollmentTypeDTO enrollmentTypeDTO);
    NewRecordVTO updateEnrollmentType(Integer enrollmentTypeId, EnrollmentTypeDTO enrollmentTypeDTO);
    void deleteEnrollmentType(Integer enrollmentTypeId);
    EnrollmentTypeVTO getEnrollmentTypeById(Integer enrollmentTypeId);
    EnrollmentTypeResultSet getAllEnrollmentTypes(String quickSearch, Integer pageNum, Integer pageSize,
                                                  OrderDirections orderDir, String orderBy);
}