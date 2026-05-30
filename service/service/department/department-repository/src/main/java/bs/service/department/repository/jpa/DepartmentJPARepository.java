package bs.service.department.repository.jpa;


import bs.olympic.department.model.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DepartmentJPARepository extends JpaRepository<Department, Integer> {

}
