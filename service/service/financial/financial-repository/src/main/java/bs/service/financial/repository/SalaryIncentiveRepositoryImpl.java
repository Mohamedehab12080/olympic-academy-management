package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.SalaryIncentiveRepository;
import bs.service.financial.model.entity.salary.incentive.SalaryIncentive;
import bs.service.financial.model.filter.SalaryIncentiveSearchFilter;
import bs.service.financial.repository.jpa.SalaryIncentiveJPARepository;
import bs.service.financial.repository.query.SalaryIncentiveQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class SalaryIncentiveRepositoryImpl implements SalaryIncentiveRepository {

    private final SalaryIncentiveJPARepository salaryIncentiveJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final SalaryIncentiveQueryBuilder queryBuilder;

    @Override
    public SalaryIncentive insert(SalaryIncentive salaryIncentive) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        salaryIncentive.setCreatedBy(currentUser);
        salaryIncentive.setCreatedOn(LocalDateTime.now());
        salaryIncentive.setIsDeleted(false);
        return salaryIncentiveJPARepository.save(salaryIncentive);
    }

    @Override
    public SalaryIncentive update(SalaryIncentive salaryIncentive) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        salaryIncentive.setLastModifiedBy(currentUser);
        salaryIncentive.setLastModifiedOn(LocalDateTime.now());
        return salaryIncentiveJPARepository.save(salaryIncentive);
    }

    @Override
    public Optional<SalaryIncentive> selectById(Integer id) {
        return salaryIncentiveJPARepository.findById(id);
    }

    @Override
    public List<SalaryIncentive> selectAllByFilters(SalaryIncentiveSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(SalaryIncentiveSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}