package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.generated.*;

import java.time.LocalDate;

public interface EmployeeAttendanceService {

    // Attendance CRUD
    NewRecordVTO createEmployeeAttendance(Integer employeeId, EmployeeAttendanceDTO employeeAttendanceDTO);
    NewRecordVTO updateEmployeeAttendance(Integer employeeId, Integer attendanceId, EmployeeAttendanceDTO employeeAttendanceDTO);
    void deleteEmployeeAttendanceById(Integer employeeId, Integer attendanceId);
    EmployeeAttendanceVTO getEmployeeAttendanceById(Integer employeeId, Integer attendanceId);
    EmployeeAttendanceResultSet getAllEmployeeAttendances(String quickSearch,Integer employeeId,String employeeNationalId, EmployeeAttendanceStatus status, LocalDate attendanceDateFrom, LocalDate attendanceDateTo, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
    DailyAttendanceReport getDailyAttendanceReport(LocalDate attendanceDate);
}