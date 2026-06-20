package bs.service.employee.api.repository;

import bs.service.employee.model.entity.EmployeeDepartment;
import bs.service.employee.model.filter.TrainerDepartmentSearchFilter;

import java.util.List;
import java.util.Optional;

public interface TrainerDepartmentRepository {
    EmployeeDepartment insert(EmployeeDepartment employeeDepartment);
    EmployeeDepartment update(EmployeeDepartment employeeDepartment);
    void delete(Integer employeeDepartmentId);
    Optional<EmployeeDepartment> selectById(Integer id);
    List<EmployeeDepartment> selectAllByFilters(TrainerDepartmentSearchFilter filters);
    Integer countAllByFilters(TrainerDepartmentSearchFilter filters);
}
