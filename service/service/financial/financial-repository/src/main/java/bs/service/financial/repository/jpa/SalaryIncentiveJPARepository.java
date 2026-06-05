package bs.service.financial.repository.jpa;

import bs.service.financial.model.entity.salary.incentive.SalaryIncentive;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SalaryIncentiveJPARepository extends JpaRepository<SalaryIncentive, Integer> {
}