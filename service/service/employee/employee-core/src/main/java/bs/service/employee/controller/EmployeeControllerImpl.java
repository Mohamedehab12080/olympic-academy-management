package bs.service.employee.controller;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.EmployeeService;
import bs.service.employee.controller.generated.EmployeeController;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.generated.EmployeeDTO;
import bs.service.employee.model.generated.EmployeeResultSet;
import bs.service.employee.model.generated.EmployeeVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class EmployeeControllerImpl implements EmployeeController {
    private final EmployeeService employeeService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createEmployee(EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.createEmployee(employeeDTO));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteEmployee(Integer employeeId) {
        employeeService.deleteEmployeeById(employeeId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EmployeeResultSet> _getAllEmployees(String quickSearch, Boolean isActive, LocalDate createdOnFrom, LocalDate createdOnTo, LocalDate hireDateFrom, LocalDate hireDateTo, Gender gender, EmployeeTypes employeeType, SalaryTypes salaryType, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(employeeService.getAllEmployees(quickSearch,isActive,createdOnFrom,createdOnTo,hireDateFrom,hireDateTo,gender,employeeType,salaryType,pageNum,pageSize,orderDir,orderBy));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EmployeeVTO> _getEmployee(Integer employeeId) {
        return ResponseEntity.ok(employeeService.getEmployeeById(employeeId));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateEmployeeById(Integer employeeId, EmployeeDTO employeeDTO) {
        return ResponseEntity.ok(employeeService.updateEmployee(employeeId, employeeDTO));
    }
}
