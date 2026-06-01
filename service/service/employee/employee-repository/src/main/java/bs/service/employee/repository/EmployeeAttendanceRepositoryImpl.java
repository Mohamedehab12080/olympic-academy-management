package bs.service.employee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.employee.api.repository.EmployeeAttendanceRepository;
import bs.service.employee.model.entity.EmployeeAttendance;
import bs.service.employee.model.filter.EmployeeAttendanceSearchFilter;
import bs.service.employee.repository.jpa.EmployeeAttendanceJPARepository;
import bs.service.employee.repository.query.EmployeeAttendanceQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EmployeeAttendanceRepositoryImpl implements EmployeeAttendanceRepository {

    private final EmployeeAttendanceJPARepository employeeAttendanceJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final EmployeeAttendanceQueryBuilder queryBuilder;

    @Override
    public EmployeeAttendance insert(EmployeeAttendance employeeAttendance) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employeeAttendance.setCreatedBy(currentUser);
        employeeAttendance.setCreatedOn(LocalDateTime.now());
        employeeAttendance.setIsDeleted(false);
        return employeeAttendanceJPARepository.save(employeeAttendance);
    }

    @Override
    public EmployeeAttendance update(EmployeeAttendance employeeAttendance) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employeeAttendance.setLastModifiedBy(currentUser);
        employeeAttendance.setLastModifiedOn(LocalDateTime.now());
        return employeeAttendanceJPARepository.save(employeeAttendance);
    }

    @Override
    public Optional<EmployeeAttendance> selectById(Integer id) {
        return employeeAttendanceJPARepository.findById(id);
    }

    @Override
    public List<EmployeeAttendance> selectAllByFilters(EmployeeAttendanceSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(EmployeeAttendanceSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}