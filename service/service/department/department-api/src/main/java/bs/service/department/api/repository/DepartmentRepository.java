package bs.service.department.api.repository;


import bs.service.department.model.entity.Department;
import bs.service.department.model.filter.DepartmentSearchFilter;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository {
    Department insert(Department department);
    Department update(Department department);
    Optional<Department> selectDepartmentById(Integer id);
    List<Department> selectDepartmentByIdIn(List<Integer> ids);
    List<Department> selectAllByFilters(DepartmentSearchFilter filters);
    Integer countAllByFilters(DepartmentSearchFilter filters);
}
