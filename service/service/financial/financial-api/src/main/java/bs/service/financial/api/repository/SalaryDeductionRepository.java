package bs.service.financial.api.repository;

import bs.service.financial.model.entity.salary.deduction.SalaryDeduction;
import bs.service.financial.model.filter.SalaryDeductionSearchFilter;

import java.util.List;
import java.util.Optional;

public interface SalaryDeductionRepository {
    SalaryDeduction insert(SalaryDeduction salaryDeduction);
    SalaryDeduction update(SalaryDeduction salaryDeduction);
    Optional<SalaryDeduction> selectById(Integer id);
    List<SalaryDeduction> selectAllByFilters(SalaryDeductionSearchFilter filters);
    Integer countAllByFilters(SalaryDeductionSearchFilter filters);
}