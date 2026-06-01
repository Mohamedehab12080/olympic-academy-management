package bs.service.employee.repository.jpa;

import bs.service.employee.model.entity.Employee;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeJPARepository extends JpaRepository<Employee, Integer> {
}
