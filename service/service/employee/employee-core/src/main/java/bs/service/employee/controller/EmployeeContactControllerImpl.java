package bs.service.employee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.EmployeeContactService;
import bs.service.employee.controller.generated.EmployeeContactController;
import bs.service.employee.model.generated.EmployeeAttendanceResultSet;
import bs.service.employee.model.generated.EmployeeContactDTO;
import bs.service.employee.model.generated.EmployeeContactResultSet;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EmployeeContactControllerImpl implements EmployeeContactController {

    private final EmployeeContactService employeeContactService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createEmployeeContact(Integer employeeId, EmployeeContactDTO employeeContactDTO) {
        return ResponseEntity.ok(employeeContactService.create(employeeId,employeeContactDTO));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteEmployeeContact(Integer employeeId, Integer contactId) {
        employeeContactService.deleteEmployeeContact(contactId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EmployeeContactResultSet> _getAllEmployeeContacts(Integer employeeId, String contactName, String contactValue, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(employeeContactService.getAllEmployeeContactByFilters(employeeId,contactName,contactValue,pageNum,pageSize,orderDir,orderBy));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateEmployeeContact(Integer employeeId, Integer contactId, EmployeeContactDTO employeeContactDTO) {
        return ResponseEntity.ok(employeeContactService.updateEmployeeContact(employeeId,contactId,employeeContactDTO));
    }
}
