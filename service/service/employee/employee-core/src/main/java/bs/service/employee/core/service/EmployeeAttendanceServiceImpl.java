package bs.service.employee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.repository.EmployeeAttendanceRepository;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.service.EmployeeAttendanceService;
import bs.service.employee.api.service.EmployeeService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.EmployeeAttendance;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.filter.EmployeeAttendanceSearchFilter;
import bs.service.employee.model.generated.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.employee.model.enums.EmployeeErrors.*;

@Service
@AllArgsConstructor
public class EmployeeAttendanceServiceImpl implements EmployeeAttendanceService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeAttendanceRepository employeeAttendanceRepository;
    private final EmployeeMapper employeeMapper;

    // ==================== Attendance CRUD ====================

    @Override
    @Transactional
    public NewRecordVTO createEmployeeAttendance(Integer employeeId, EmployeeAttendanceDTO employeeAttendanceDTO) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));

        EmployeeAttendance employeeAttendance = employeeMapper.toEmployeeAttendance(employeeAttendanceDTO);
        employeeAttendance.setEmployee(employee);
        employeeAttendance = employeeAttendanceRepository.insert(employeeAttendance);

        return NewRecordVTO.builder().id(employeeAttendance.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEmployeeAttendance(Integer employeeId, Integer attendanceId, EmployeeAttendanceDTO employeeAttendanceDTO) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));

        EmployeeAttendance employeeAttendance = employeeAttendanceRepository.selectById(attendanceId)
                .orElseThrow(() -> new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId));

        if (!employeeAttendance.getEmployee().getId().equals(employeeId)) {
            throw new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId);
        }

        EmployeeAttendance attendanceToUpdate = employeeMapper.toEmployeeAttendance(employeeAttendanceDTO);
        attendanceToUpdate.setId(attendanceId);
        attendanceToUpdate.setEmployee(employee);
        employeeAttendanceRepository.update(attendanceToUpdate);

        return NewRecordVTO.builder().id(attendanceId).build();
    }

    @Override
    @Transactional
    public void deleteEmployeeAttendanceById(Integer employeeId, Integer attendanceId) {
        EmployeeAttendance employeeAttendance = employeeAttendanceRepository.selectById(attendanceId)
                .orElseThrow(() -> new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId));

        if (!employeeAttendance.getEmployee().getId().equals(employeeId)) {
            throw new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId);
        }

        employeeAttendance.setIsDeleted(true);
        employeeAttendanceRepository.update(employeeAttendance);
    }

    @Override
    public EmployeeAttendanceVTO getEmployeeAttendanceById(Integer employeeId, Integer attendanceId) {
        EmployeeAttendance employeeAttendance = employeeAttendanceRepository.selectById(attendanceId)
                .orElseThrow(() -> new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId));

        if (!employeeAttendance.getEmployee().getId().equals(employeeId)) {
            throw new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId);
        }

        return employeeMapper.toEmployeeAttendanceVTO(employeeAttendance);
    }

    @Override
    public EmployeeAttendanceResultSet getAllEmployeeAttendances(Integer employeeId, EmployeeAttendanceStatus status, LocalDate attendanceDateFrom, LocalDate attendanceDateTo, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        EmployeeAttendanceSearchFilter filter = EmployeeAttendanceSearchFilter.builder()
                .employeeId(employeeId)
                .status(status.title)
                .attendanceDateFrom(attendanceDateFrom)
                .attendanceDateTo(attendanceDateTo)
                .checkInFrom(checkInFrom)
                .checkInTo(checkInTo)
                .checkOutFrom(checkOutFrom)
                .checkOutTo(checkOutTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EmployeeAttendanceSearchFilter.OrderByAttributes.ATTENDANCE_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<EmployeeAttendance> attendances = employeeAttendanceRepository.selectAllByFilters(filter);
        List<EmployeeAttendanceListItem> items = employeeMapper.toEmployeeAttendanceListItems(attendances);

        return EmployeeAttendanceResultSet.builder()
                .items(items)
                .total(employeeAttendanceRepository.countAllByFilters(filter))
                .build();
    }

    @Override
    public DailyAttendanceReport getDailyAttendanceReport(LocalDate attendanceDate) {
        EmployeeAttendanceSearchFilter filter = EmployeeAttendanceSearchFilter.builder()
                .attendanceDateFrom(attendanceDate)
                .attendanceDateTo(attendanceDate)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<EmployeeAttendance> attendances = employeeAttendanceRepository.selectAllByFilters(filter);

        long totalEmployees = attendances.size();
        long present = attendances.stream().filter(a -> a.getStatus() == EmployeeAttendanceStatus.PRESENT).count();
        long absent = attendances.stream().filter(a -> a.getStatus() == EmployeeAttendanceStatus.ABSENT).count();
        long late = attendances.stream().filter(a -> a.getStatus() == EmployeeAttendanceStatus.LATE).count();
        long excused = attendances.stream().filter(a -> a.getStatus() == EmployeeAttendanceStatus.EXCUSED).count();

        double attendanceRate = totalEmployees > 0 ? (double) (present + late) / totalEmployees * 100 : 0;

        List<EmployeeAttendanceListItem> details = employeeMapper.toEmployeeAttendanceListItems(attendances);

        return DailyAttendanceReport.builder()
                .attendanceDate(attendanceDate)
                .totalEmployees((int) totalEmployees)
                .present((int) present)
                .absent((int) absent)
                .late((int) late)
                .excused((int) excused)
                .attendanceRate(attendanceRate)
                .details(details)
                .build();
    }
}