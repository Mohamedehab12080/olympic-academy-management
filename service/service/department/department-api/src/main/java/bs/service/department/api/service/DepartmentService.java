package bs.service.department.api.service;

import bs.lib.common.model.interfaces.vto.NewRecordVTO;
import bs.olympic.department.model.entity.Department;
import bs.olympic.department.model.filter.DepartmentSearchFilter;

import java.util.List;
import java.util.Optional;

public class DepartmentService {
    NewRecordVTO create(DepartmentDTO departmentDTO);
    NewRecordVTO update(Integer departmentId,DepartmentDTO departmentDTO);
    Optional<Department> getDepartmentById(Integer id);
    List<Department> selectAllByFilters(DepartmentSearchFilter filters);
    Long countAllByFilters(DepartmentSearchFilter filters);
}
