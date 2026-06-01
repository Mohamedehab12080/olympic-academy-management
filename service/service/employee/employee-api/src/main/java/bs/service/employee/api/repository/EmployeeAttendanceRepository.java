package bs.service.employee.api.repository;

import bs.service.employee.model.entity.EmployeeAttendance;
import bs.service.employee.model.filter.EmployeeAttendanceSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EmployeeAttendanceRepository {
    EmployeeAttendance insert(EmployeeAttendance employeeAttendance);
    EmployeeAttendance update(EmployeeAttendance employeeAttendance);
    Optional<EmployeeAttendance> selectById(Integer id);
    List<EmployeeAttendance> selectAllByFilters(EmployeeAttendanceSearchFilter filters);
    Integer countAllByFilters(EmployeeAttendanceSearchFilter filters);
}