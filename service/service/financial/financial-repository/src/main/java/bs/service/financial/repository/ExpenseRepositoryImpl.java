package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.ExpenseRepository;
import bs.service.financial.model.entity.expense.Expense;
import bs.service.financial.model.filter.ExpenseSearchFilter;
import bs.service.financial.repository.jpa.ExpenseJPARepository;
import bs.service.financial.repository.query.ExpenseQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class ExpenseRepositoryImpl implements ExpenseRepository {

    private final ExpenseJPARepository expenseJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final ExpenseQueryBuilder queryBuilder;

    @Override
    public Expense insert(Expense expense) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        expense.setCreatedBy(currentUser);
        expense.setCreatedOn(LocalDateTime.now());
        expense.setIsDeleted(false);
        return expenseJPARepository.save(expense);
    }

    @Override
    public Expense update(Expense expense) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        expense.setLastModifiedBy(currentUser);
        expense.setLastModifiedOn(LocalDateTime.now());
        return expenseJPARepository.save(expense);
    }

    @Override
    public Optional<Expense> selectById(Integer id) {
        return expenseJPARepository.findById(id);
    }

    @Override
    public List<Expense> selectAllByFilters(ExpenseSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(ExpenseSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}