package bs.service.enrollment.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.api.service.EnrollmentTypeService;
import bs.service.enrollment.controller.generated.EnrollmentTypeController;
import bs.service.enrollment.model.generated.EnrollmentTypeDTO;
import bs.service.enrollment.model.generated.EnrollmentTypeResultSet;
import bs.service.enrollment.model.generated.EnrollmentTypeVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class EnrollmentTypeControllerImpl implements EnrollmentTypeController {

    private final EnrollmentTypeService enrollmentTypeService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createEnrollmentType(EnrollmentTypeDTO enrollmentTypeDTO) {
        NewRecordVTO result = enrollmentTypeService.createEnrollmentType(enrollmentTypeDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteEnrollmentType(Integer enrollmentTypeId) {
        enrollmentTypeService.deleteEnrollmentType(enrollmentTypeId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EnrollmentTypeResultSet> _getAllEnrollmentTypes(String quickSearch, Integer pageNum,
                                                                          Integer pageSize, OrderDirections orderDir,
                                                                          String orderBy) {
        EnrollmentTypeResultSet result = enrollmentTypeService.getAllEnrollmentTypes(
                quickSearch, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EnrollmentTypeVTO> _getEnrollmentTypeById(Integer enrollmentTypeId) {
        EnrollmentTypeVTO result = enrollmentTypeService.getEnrollmentTypeById(enrollmentTypeId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateEnrollmentType(Integer enrollmentTypeId, EnrollmentTypeDTO enrollmentTypeDTO) {
        NewRecordVTO result = enrollmentTypeService.updateEnrollmentType(enrollmentTypeId, enrollmentTypeDTO);
        return ResponseEntity.ok(result);
    }
}