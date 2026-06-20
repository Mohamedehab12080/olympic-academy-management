package bs.service.employee.repository.jpa;

import bs.service.employee.model.entity.EmployeeDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeDepartmentJPARepository extends JpaRepository<EmployeeDepartment, Integer> {
}
