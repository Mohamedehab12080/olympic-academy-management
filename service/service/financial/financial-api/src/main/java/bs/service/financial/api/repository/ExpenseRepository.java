package bs.service.financial.api.repository;

import bs.service.financial.model.entity.expense.Expense;
import bs.service.financial.model.filter.ExpenseSearchFilter;

import java.util.List;
import java.util.Optional;

public interface ExpenseRepository {
    Expense insert(Expense expense);
    Expense update(Expense expense);
    Optional<Expense> selectById(Integer id);
    List<Expense> selectAllByFilters(ExpenseSearchFilter filters);
    Integer countAllByFilters(ExpenseSearchFilter filters);
}