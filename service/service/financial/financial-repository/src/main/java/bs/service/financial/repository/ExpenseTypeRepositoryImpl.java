package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.ExpenseTypeRepository;
import bs.service.financial.model.entity.expense.ExpenseType;
import bs.service.financial.model.filter.ExpenseTypeSearchFilter;
import bs.service.financial.repository.jpa.ExpenseTypeJPARepository;
import bs.service.financial.repository.query.ExpenseTypeQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class ExpenseTypeRepositoryImpl implements ExpenseTypeRepository {

    private final ExpenseTypeJPARepository expenseTypeJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final ExpenseTypeQueryBuilder queryBuilder;

    @Override
    public ExpenseType insert(ExpenseType expenseType) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        expenseType.setCreatedBy(currentUser);
        expenseType.setCreatedOn(LocalDateTime.now());
        expenseType.setIsDeleted(false);
        return expenseTypeJPARepository.save(expenseType);
    }

    @Override
    public ExpenseType update(ExpenseType expenseType) {
        return expenseTypeJPARepository.save(expenseType);
    }

    @Override
    public Optional<ExpenseType> selectById(Integer id) {
        return expenseTypeJPARepository.findById(id);
    }

    @Override
    public List<ExpenseType> selectAllByFilters(ExpenseTypeSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(ExpenseTypeSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}