package bs.service.employee.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.employee.api.service.EmployeeService;
import bs.service.employee.controller.generated.LookupController;
import bs.service.employee.model.generated.EmployeeLookupVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@AllArgsConstructor
public class LookupControllerImpl implements LookupController {

    private final EmployeeService employeeService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllEmployeeAttendanceStatusLookup() {
        return ResponseEntity.ok(employeeService.getAllEmployeeAttendanceStatusLookup());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllEmployeeTypesLookup() {
        return ResponseEntity.ok(employeeService.getAllEmployeeTypesLookup());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<List<EmployeeLookupVTO>> _getAllEmployeesLookup() {
        return ResponseEntity.ok(employeeService.getAllEmployeesLookup());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllTrainersLookup() {
        return ResponseEntity.ok(employeeService.getAllTrainersLookup());
    }
}
