package bs.service.employee.repository.jpa;

import bs.service.employee.model.entity.EmployeeContact;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmployeeContactJPARepository extends JpaRepository<EmployeeContact, Integer> {
}
