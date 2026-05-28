package bs.olympic.department.api.repository;

import bs.olympic.department.model.entity.Department;
import bs.olympic.department.model.filter.DepartmentSearchFilter;

import java.util.List;
import java.util.Optional;

public interface DepartmentRepository {
    Department insert(Department department);
    Department update(Department department);
    Optional<Department> getDepartmentById(Integer id);
    List<Department> selectAllByFilters(DepartmentSearchFilter filters);
    Long countAllByFilters(DepartmentSearchFilter filters);
}
