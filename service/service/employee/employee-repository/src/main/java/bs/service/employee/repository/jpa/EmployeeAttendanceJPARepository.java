package bs.service.employee.repository.jpa;

import bs.service.employee.model.entity.EmployeeAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface EmployeeAttendanceJPARepository extends JpaRepository<EmployeeAttendance, Integer> {
}