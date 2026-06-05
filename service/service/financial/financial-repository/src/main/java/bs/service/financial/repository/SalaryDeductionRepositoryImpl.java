package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.SalaryDeductionRepository;
import bs.service.financial.model.entity.salary.deduction.SalaryDeduction;
import bs.service.financial.model.filter.SalaryDeductionSearchFilter;
import bs.service.financial.repository.jpa.SalaryDeductionJPARepository;
import bs.service.financial.repository.query.SalaryDeductionQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class SalaryDeductionRepositoryImpl implements SalaryDeductionRepository {

    private final SalaryDeductionJPARepository salaryDeductionJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final SalaryDeductionQueryBuilder queryBuilder;

    @Override
    public SalaryDeduction insert(SalaryDeduction salaryDeduction) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        salaryDeduction.setCreatedBy(currentUser);
        salaryDeduction.setCreatedOn(LocalDateTime.now());
        salaryDeduction.setIsDeleted(false);
        return salaryDeductionJPARepository.save(salaryDeduction);
    }

    @Override
    public SalaryDeduction update(SalaryDeduction salaryDeduction) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        salaryDeduction.setLastModifiedBy(currentUser);
        salaryDeduction.setLastModifiedOn(LocalDateTime.now());
        return salaryDeductionJPARepository.save(salaryDeduction);
    }

    @Override
    public Optional<SalaryDeduction> selectById(Integer id) {
        return salaryDeductionJPARepository.findById(id);
    }

    @Override
    public List<SalaryDeduction> selectAllByFilters(SalaryDeductionSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(SalaryDeductionSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}