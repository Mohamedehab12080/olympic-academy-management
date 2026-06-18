package bs.service.employee.api.service;


import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.generated.EmployeeDTO;
import bs.service.employee.model.generated.EmployeeLookupVTO;
import bs.service.employee.model.generated.EmployeeResultSet;
import bs.service.employee.model.generated.EmployeeVTO;

import java.time.LocalDate;
import java.util.List;

public interface EmployeeService {
    NewRecordVTO createEmployee(EmployeeDTO employeeDTO);
    NewRecordVTO updateEmployee(Integer employeeId, EmployeeDTO employeeDTO);
    void deleteEmployeeById(Integer employeeId);
    EmployeeVTO getEmployeeById(Integer employeeId);
    EmployeeResultSet getAllEmployees(String quickSearch, Boolean isActive,
                                      LocalDate createdOnFrom, LocalDate createdOnTo,
                                      LocalDate hireDateFrom, LocalDate hireDateTo,
                                      Gender gender, EmployeeTypes employeeType,
                                      SalaryTypes salaryType, Integer pageNum, Integer pageSize,
                                      OrderDirections orderDir, String orderBy);
    List<EmployeeLookupVTO> getAllEmployeesLookup();
    LookupResultSet getAllEmployeeTypesLookup();
    LookupResultSet getAllEmployeeAttendanceStatusLookup();
    LookupResultSet getAllTrainersLookup();

}