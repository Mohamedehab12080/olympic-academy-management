package bs.service.financial.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.ExpenseTypeDTO;
import bs.service.financial.model.generated.ExpenseTypeResultSet;
import bs.service.financial.model.generated.ExpenseTypeVTO;

public interface ExpenseTypeService {
    NewRecordVTO createExpenseType(ExpenseTypeDTO expenseTypeDTO);
    NewRecordVTO updateExpenseType(Integer expenseTypeId, ExpenseTypeDTO expenseTypeDTO);
    void deleteExpenseType(Integer expenseTypeId);
    ExpenseTypeVTO getExpenseTypeById(Integer expenseTypeId);
    ExpenseTypeResultSet getAllExpenseTypes(String quickSearch, Boolean isActive, Integer pageNum, Integer pageSize,
                                            OrderDirections orderDir, String orderBy);
}