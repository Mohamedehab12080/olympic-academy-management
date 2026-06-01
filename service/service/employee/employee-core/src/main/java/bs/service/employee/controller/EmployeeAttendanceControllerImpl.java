package bs.service.employee.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.service.EmployeeAttendanceService;
import bs.service.employee.controller.generated.EmployeeAttendanceController;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.generated.DailyAttendanceReport;
import bs.service.employee.model.generated.EmployeeAttendanceDTO;
import bs.service.employee.model.generated.EmployeeAttendanceResultSet;
import bs.service.employee.model.generated.EmployeeAttendanceVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class EmployeeAttendanceControllerImpl implements EmployeeAttendanceController {

    private final EmployeeAttendanceService employeeAttendanceService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createEmployeeAttendance(Integer employeeId, EmployeeAttendanceDTO employeeAttendanceDTO) {
        return ResponseEntity.ok(employeeAttendanceService.createEmployeeAttendance(employeeId, employeeAttendanceDTO));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteEmployeeAttendance(Integer employeeId, Integer attendanceId) {
        employeeAttendanceService.deleteEmployeeAttendanceById(employeeId, attendanceId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EmployeeAttendanceResultSet> _getAllEmployeeAttendances(Integer employeeId, EmployeeAttendanceStatus status, LocalDate attendanceDateFrom, LocalDate attendanceDateTo, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(employeeAttendanceService.getAllEmployeeAttendances(employeeId,status,attendanceDateFrom,attendanceDateTo,checkInFrom,checkInTo,checkOutFrom,checkOutTo,pageNum,pageSize,orderDir,orderBy));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EmployeeAttendanceResultSet> _getAllEmployeesAttendances(Integer employeeId, EmployeeAttendanceStatus status, LocalDate attendanceDateFrom, LocalDate attendanceDateTo, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(employeeAttendanceService.getAllEmployeeAttendances(employeeId,status,attendanceDateFrom,attendanceDateTo,checkInFrom,checkInTo,checkOutFrom,checkOutTo,pageNum,pageSize,orderDir,orderBy));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<DailyAttendanceReport> _getDailyAttendanceReport(LocalDate attendanceDate) {
        return ResponseEntity.ok(employeeAttendanceService.getDailyAttendanceReport(attendanceDate));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<EmployeeAttendanceVTO> _getEmployeeAttendance(Integer employeeId, Integer attendanceId) {
        return ResponseEntity.ok(employeeAttendanceService.getEmployeeAttendanceById(employeeId, attendanceId));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateEmployeeAttendance(Integer employeeId, Integer attendanceId, EmployeeAttendanceDTO employeeAttendanceDTO) {
        return ResponseEntity.ok(employeeAttendanceService.updateEmployeeAttendance(employeeId,attendanceId,employeeAttendanceDTO));
    }
}
