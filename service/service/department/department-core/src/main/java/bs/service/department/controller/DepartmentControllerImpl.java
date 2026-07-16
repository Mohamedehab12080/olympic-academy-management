package bs.service.department.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.department.api.service.DepartmentService;
import bs.service.department.controller.generated.DepartmentController;
import bs.service.department.model.generated.DepartmentDTO;
import bs.service.department.model.generated.DepartmentResultSet;
import bs.service.department.model.generated.DepartmentVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class DepartmentControllerImpl implements DepartmentController {

    private final DepartmentService departmentService;

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<DepartmentVTO> _getDepartment(Integer departmentId,LocalDate createdOnFrom,LocalDate createdOnTo) {
        return ResponseEntity.ok(departmentService.getDepartmentDetailsById(departmentId,createdOnFrom,createdOnTo));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<DepartmentVTO> _getDepartmentById(Integer departmentId) {
        return ResponseEntity.ok(departmentService.getDepartmentById(departmentId));
    }


    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateDepartmentById(Integer departmentId, DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(departmentService.update(departmentId,departmentDTO));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createDepartment(DepartmentDTO departmentDTO) {
        return ResponseEntity.ok(departmentService.create(departmentDTO));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteDepartment(Integer departmentId) {
        departmentService.deleteDepartmentById(departmentId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<DepartmentResultSet> _getAllDepartments(String quickSearch, LocalDate createdOnFrom, LocalDate createdOnTo, LocalDate lastModifiedOnFrom, LocalDate lastModifiedOnTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(departmentService.selectAllDepartmentsByFilters(quickSearch, createdOnFrom, createdOnTo, lastModifiedOnFrom, lastModifiedOnTo, pageNum, pageSize, orderDir, orderBy));
    }

}
