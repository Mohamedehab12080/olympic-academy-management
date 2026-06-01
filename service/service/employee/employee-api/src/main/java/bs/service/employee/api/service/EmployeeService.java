package bs.service.employee.api.service;


import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.generated.EmployeeContactDTO;
import bs.service.employee.model.generated.EmployeeDTO;
import bs.service.employee.model.generated.EmployeeResultSet;
import bs.service.employee.model.generated.EmployeeVTO;

import java.time.LocalDate;

public interface EmployeeService {
    NewRecordVTO createEmployee(EmployeeDTO employeeDTO);
    NewRecordVTO updateEmployee(Integer employeeId, EmployeeDTO employeeDTO);
    void deleteEmployeeById(Integer employeeId);
    EmployeeVTO getEmployeeById(Integer employeeId);
    NewRecordVTO updateEmployeeContact(Integer employeeId, Integer contactId, EmployeeContactDTO employeeContactDTO);
    EmployeeResultSet getAllEmployees(String quickSearch, Boolean isActive,
                                      LocalDate createdOnFrom, LocalDate createdOnTo,
                                      LocalDate hireDateFrom, LocalDate hireDateTo,
                                      Gender gender, EmployeeTypes employeeType,
                                      SalaryTypes salaryType, Integer pageNum, Integer pageSize,
                                      OrderDirections orderDir, String orderBy);
    LookupResultSet getAllEmployeesLookup();
    LookupResultSet getAllEmployeeTypesLookup();
    LookupResultSet getAllEmployeeAttendanceStatusLookup();
}