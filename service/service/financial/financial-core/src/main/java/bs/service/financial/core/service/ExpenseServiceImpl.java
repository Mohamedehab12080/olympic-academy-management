package bs.service.financial.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.repository.ExpenseRepository;
import bs.service.financial.api.service.ExpenseService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.expense.Expense;
import bs.service.financial.model.filter.ExpenseSearchFilter;
import bs.service.financial.model.generated.ExpenseDTO;
import bs.service.financial.model.generated.ExpenseResultSet;
import bs.service.financial.model.generated.ExpenseVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.EXPENSE_NOT_FOUND;
import static bs.service.financial.model.enums.FinancialErrors.INVALID_EXPENSE_AMOUNT;

@Service
@AllArgsConstructor
public class ExpenseServiceImpl implements ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createExpense(ExpenseDTO expenseDTO) {
        if (expenseDTO.getAmountExpensed() == null || expenseDTO.getAmountExpensed() <= 0) {
            throw new BusinessException(INVALID_EXPENSE_AMOUNT);
        }

        Expense expense = financialMapper.toExpense(expenseDTO);
        expense = expenseRepository.insert(expense);
        return NewRecordVTO.builder().id(expense.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateExpense(Integer expenseId, ExpenseDTO expenseDTO) {
        Expense expense = expenseRepository.selectById(expenseId)
                .orElseThrow(() -> new BusinessException(EXPENSE_NOT_FOUND, expenseId));

        Expense expenseToUpdate = financialMapper.toExpense(expenseDTO);
        expenseToUpdate.setId(expenseId);
        expenseRepository.update(expenseToUpdate);
        return NewRecordVTO.builder().id(expenseId).build();
    }

    @Override
    @Transactional
    public void deleteExpense(Integer expenseId) {
        Expense expense = expenseRepository.selectById(expenseId)
                .orElseThrow(() -> new BusinessException(EXPENSE_NOT_FOUND, expenseId));
        expense.setIsDeleted(true);
        expenseRepository.update(expense);
    }

    @Override
    public ExpenseVTO getExpenseById(Integer expenseId) {
        Expense expense = expenseRepository.selectById(expenseId)
                .orElseThrow(() -> new BusinessException(EXPENSE_NOT_FOUND, expenseId));
        return financialMapper.toExpenseVTO(expense);
    }

    @Override
    public ExpenseResultSet getAllExpensesByFilter(Integer expenseTypeId, Integer paymentMethodId,
                                                   LocalDate expenseDateFrom, LocalDate expenseDateTo,
                                                   Integer pageNum, Integer pageSize,
                                                   OrderDirections orderDir, String orderBy) {
        ExpenseSearchFilter filter = ExpenseSearchFilter.builder()
                .expenseTypeId(expenseTypeId)
                .paymentMethodId(paymentMethodId)
                .expenseDateFrom(expenseDateFrom)
                .expenseDateTo(expenseDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(ExpenseSearchFilter.OrderByAttributes.EXPENSE_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<Expense> expenses = expenseRepository.selectAllByFilters(filter);
        List<ExpenseVTO> items = financialMapper.toExpenseVTOs(expenses);

        return ExpenseResultSet.builder()
                .items(items)
                .total(expenseRepository.countAllByFilters(filter))
                .build();
    }
}