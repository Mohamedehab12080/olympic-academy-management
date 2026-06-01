package bs.service.employee.api.repository;


import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.filter.EmployeeContactSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EmployeeContactRepository {
    EmployeeContact insert(EmployeeContact employeeContact);
    EmployeeContact update(EmployeeContact employeeContact);
    void delete(Integer employeeContactId);
    Optional<EmployeeContact> selectById(Integer id);
    List<EmployeeContact> selectAllByFilters(EmployeeContactSearchFilter filters);
    Integer countAllByFilters(EmployeeContactSearchFilter filters);
}
