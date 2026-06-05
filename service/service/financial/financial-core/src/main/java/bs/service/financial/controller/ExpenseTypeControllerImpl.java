package bs.service.financial.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.ExpenseTypeService;
import bs.service.financial.controller.generated.ExpenseTypeController;
import bs.service.financial.model.generated.ExpenseTypeDTO;
import bs.service.financial.model.generated.ExpenseTypeResultSet;
import bs.service.financial.model.generated.ExpenseTypeVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class ExpenseTypeControllerImpl implements ExpenseTypeController {

    private final ExpenseTypeService expenseTypeService;

    @Override
    public ResponseEntity<NewRecordVTO> _createExpenseType(ExpenseTypeDTO expenseTypeDTO) {
        NewRecordVTO result = expenseTypeService.createExpenseType(expenseTypeDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteExpenseType(Integer expenseTypeId) {
        expenseTypeService.deleteExpenseType(expenseTypeId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<ExpenseTypeResultSet> _getAllExpenseTypes(
            String quickSearch, Boolean isActive,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        ExpenseTypeResultSet result = expenseTypeService.getAllExpenseTypes(
                quickSearch, isActive, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<ExpenseTypeVTO> _getExpenseTypeById(Integer expenseTypeId) {
        ExpenseTypeVTO result = expenseTypeService.getExpenseTypeById(expenseTypeId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateExpenseType(Integer expenseTypeId, ExpenseTypeDTO expenseTypeDTO) {
        NewRecordVTO result = expenseTypeService.updateExpenseType(expenseTypeId, expenseTypeDTO);
        return ResponseEntity.ok(result);
    }
}