package bs.service.financial.api.repository;

import bs.service.financial.model.entity.salary.incentive.SalaryIncentive;
import bs.service.financial.model.filter.SalaryIncentiveSearchFilter;

import java.util.List;
import java.util.Optional;

public interface SalaryIncentiveRepository {
    SalaryIncentive insert(SalaryIncentive salaryIncentive);
    SalaryIncentive update(SalaryIncentive salaryIncentive);
    Optional<SalaryIncentive> selectById(Integer id);
    List<SalaryIncentive> selectAllByFilters(SalaryIncentiveSearchFilter filters);
    Integer countAllByFilters(SalaryIncentiveSearchFilter filters);
}