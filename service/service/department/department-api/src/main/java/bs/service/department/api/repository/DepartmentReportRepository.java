package bs.service.department.api.repository;

import bs.service.department.model.generated.DepartmentVTO;

import java.time.LocalDate;

public interface DepartmentReportRepository {
    DepartmentVTO getDepartmentReport(Integer departmentId, LocalDate fromDate, LocalDate toDate);
}
