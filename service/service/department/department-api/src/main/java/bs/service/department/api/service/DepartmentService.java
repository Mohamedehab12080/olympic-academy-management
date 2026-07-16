package bs.service.department.api.service;

import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.department.model.filter.DepartmentSearchFilter;
import bs.service.department.model.generated.*;

import java.time.LocalDate;

public interface DepartmentService {
    NewRecordVTO create(DepartmentDTO departmentDTO);
    NewRecordVTO update(Integer departmentId,DepartmentDTO departmentDTO);
    DepartmentVTO getDepartmentDetailsById(Integer id,LocalDate from, LocalDate to);
    DepartmentVTO getDepartmentById(Integer id);
    Boolean existsById(Integer id);
    DepartmentResultSet selectAllDepartmentsByFilters(String quickSearch, LocalDate createdOnFrom, LocalDate createdOnTo, LocalDate lastModifiedOnFrom, LocalDate lastModifiedOnTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
    void deleteDepartmentById(Integer id);
    LookupResultSet getAllDepartments();
}
