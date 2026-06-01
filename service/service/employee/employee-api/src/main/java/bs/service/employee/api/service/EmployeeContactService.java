package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.generated.EmployeeContactDTO;
import bs.service.employee.model.generated.EmployeeContactResultSet;
import bs.service.employee.model.generated.EmployeeContactVTO;

public interface EmployeeContactService {
    NewRecordVTO create(EmployeeContactDTO employeeContactDTO);
    NewRecordVTO updateEmployeeContact(Integer employeeId, Integer contactId, EmployeeContactDTO employeeContactDTO);
    void deleteEmployeeContact(Integer contactId);
    EmployeeContactResultSet getAllEmployeeContactByFilters(Integer employeeId, String contactName, String contactValue, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
    EmployeeContactVTO getEmployeeContactById(Integer contactId);
}
