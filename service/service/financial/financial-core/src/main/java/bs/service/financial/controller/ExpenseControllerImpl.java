package bs.service.financial.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.ExpenseService;
import bs.service.financial.controller.generated.ExpenseController;
import bs.service.financial.model.generated.ExpenseDTO;
import bs.service.financial.model.generated.ExpenseResultSet;
import bs.service.financial.model.generated.ExpenseVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class ExpenseControllerImpl implements ExpenseController {

    private final ExpenseService expenseService;

    @Override
    public ResponseEntity<NewRecordVTO> _createExpense(ExpenseDTO expenseDTO) {
        NewRecordVTO result = expenseService.createExpense(expenseDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteExpense(Integer expenseId) {
        expenseService.deleteExpense(expenseId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<ExpenseResultSet> _getAllExpensesByFilter(
            Integer expenseTypeId, Integer paymentMethodId,
            LocalDate expenseDateFrom, LocalDate expenseDateTo,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        ExpenseResultSet result = expenseService.getAllExpensesByFilter(
                expenseTypeId, paymentMethodId, expenseDateFrom, expenseDateTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<ExpenseVTO> _getExpenseById(Integer expenseId) {
        ExpenseVTO result = expenseService.getExpenseById(expenseId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateExpense(Integer expenseId, ExpenseDTO expenseDTO) {
        NewRecordVTO result = expenseService.updateExpense(expenseId, expenseDTO);
        return ResponseEntity.ok(result);
    }
}