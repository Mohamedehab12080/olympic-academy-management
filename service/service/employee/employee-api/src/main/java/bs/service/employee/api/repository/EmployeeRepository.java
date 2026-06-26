package bs.service.employee.api.repository;


import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.filter.EmployeeSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EmployeeRepository {
    Employee insert(Employee employee);
    Employee update(Employee employee);
    Optional<Employee> selectById(Integer id);
    List<Employee> selectAllById(List<Integer> ids);
    List<Employee> selectAllByFilters(EmployeeSearchFilter filters);
    Integer countAllByFilters(EmployeeSearchFilter filters);
}