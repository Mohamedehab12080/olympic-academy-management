package bs.service.employee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.EmployeeContactService;
import bs.service.employee.controller.generated.EmployeeContactController;
import bs.service.employee.model.generated.EmployeeAttendanceResultSet;
import bs.service.employee.model.generated.EmployeeContactDTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class EmployeeContactControllerImpl implements EmployeeContactController {

    private final EmployeeContactService employeeContactService;

    @Override
    public ResponseEntity<EmployeeAttendanceResultSet> _getAllEmployeeContacts(Integer employeeId, String contactName, String contactValue, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return null;
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateEmployeeContact(Integer employeeId, Integer contactId, EmployeeContactDTO employeeContactDTO) {
        return null;
    }
}
