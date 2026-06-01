package bs.service.employee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.filter.EmployeeSearchFilter;
import bs.service.employee.repository.jpa.EmployeeJPARepository;
import bs.service.employee.repository.query.EmployeeQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EmployeeRepositoryImpl implements EmployeeRepository {

    private final EmployeeJPARepository employeeJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final EmployeeQueryBuilder queryBuilder;

    @Override
    public Employee insert(Employee employee) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employee.setCreatedBy(currentUser);
        employee.setCreatedOn(LocalDateTime.now());
        employee.setIsActive(true);
        employee.setIsDeleted(false);
        return employeeJPARepository.save(employee);
    }

    @Override
    public Employee update(Employee employee) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employee.setLastModifiedBy(currentUser);
        employee.setLastModifiedOn(LocalDateTime.now());
        return employeeJPARepository.save(employee);
    }

    @Override
    public Optional<Employee> selectById(Integer id) {
        return employeeJPARepository.findById(id);
    }

    @Override
    public List<Employee> selectAllByFilters(EmployeeSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(EmployeeSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}