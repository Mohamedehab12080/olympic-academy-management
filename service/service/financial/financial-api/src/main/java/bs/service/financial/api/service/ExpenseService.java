package bs.service.financial.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.ExpenseDTO;
import bs.service.financial.model.generated.ExpenseResultSet;
import bs.service.financial.model.generated.ExpenseVTO;

import java.time.LocalDate;

public interface ExpenseService {
    NewRecordVTO createExpense(ExpenseDTO expenseDTO);
    NewRecordVTO updateExpense(Integer expenseId, ExpenseDTO expenseDTO);
    void deleteExpense(Integer expenseId);
    ExpenseVTO getExpenseById(Integer expenseId);
    ExpenseResultSet getAllExpensesByFilter(Integer expenseTypeId, Integer paymentMethodId,
                                            LocalDate expenseDateFrom, LocalDate expenseDateTo,
                                            Integer pageNum, Integer pageSize,
                                            OrderDirections orderDir, String orderBy);
}