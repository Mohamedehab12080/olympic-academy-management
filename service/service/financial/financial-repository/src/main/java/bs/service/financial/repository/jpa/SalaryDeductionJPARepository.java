package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.salary.deduction.SalaryDeduction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryDeductionJPARepository extends JpaRepository<SalaryDeduction, Integer> {
}