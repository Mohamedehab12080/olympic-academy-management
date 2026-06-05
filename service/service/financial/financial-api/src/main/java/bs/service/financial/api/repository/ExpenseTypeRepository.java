package bs.service.financial.api.repository;

import bs.service.financial.model.entity.expense.ExpenseType;
import bs.service.financial.model.filter.ExpenseTypeSearchFilter;

import java.util.List;
import java.util.Optional;

public interface ExpenseTypeRepository {
    ExpenseType insert(ExpenseType expenseType);
    ExpenseType update(ExpenseType expenseType);
    Optional<ExpenseType> selectById(Integer id);
    List<ExpenseType> selectAllByFilters(ExpenseTypeSearchFilter filters);
    Integer countAllByFilters(ExpenseTypeSearchFilter filters);
}