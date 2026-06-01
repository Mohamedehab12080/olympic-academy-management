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
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EmployeeContactControllerImpl implements EmployeeContactController {

    private final EmployeeContactService employeeContactService;

    @Override
    public ResponseEntity<NewRecordVTO> _createEmployeeContact(Integer employeeId, EmployeeContactDTO employeeContactDTO) {
        return ResponseEntity.ok(employeeContactService.create(employeeId,employeeContactDTO));
    }

    @Override
    public ResponseEntity<Void> _deleteEmployeeContact(Integer employeeId, Integer contactId) {
        employeeContactService.deleteEmployeeContact(contactId);
        return ResponseEntity.noContent().build();
    }

    @Override
    public ResponseEntity<EmployeeContactResultSet> _getAllEmployeeContacts(Integer employeeId, String contactName, String contactValue, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(employeeContactService.getAllEmployeeContactByFilters(employeeId,contactName,contactValue,pageNum,pageSize,orderDir,orderBy));
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateEmployeeContact(Integer employeeId, Integer contactId, EmployeeContactDTO employeeContactDTO) {
        return ResponseEntity.ok(employeeContactService.updateEmployeeContact(employeeId,contactId,employeeContactDTO));
    }
}
