package bs.service.financial.controller;

import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.SalaryDeductionService;
import bs.service.financial.controller.generated.SalaryDeductionController;
import bs.service.financial.model.generated.SalaryDeductionDTO;
import bs.service.financial.model.generated.SalaryDeductionResultSet;
import bs.service.financial.model.generated.SalaryDeductionVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class SalaryDeductionControllerImpl implements SalaryDeductionController {

    private final SalaryDeductionService salaryDeductionService;

    @Override
    public ResponseEntity<NewRecordVTO> _createSalaryDeduction(SalaryDeductionDTO salaryDeductionDTO) {
        NewRecordVTO result = salaryDeductionService.createSalaryDeduction(salaryDeductionDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteSalaryDeduction(Integer deductionId) {
        salaryDeductionService.deleteSalaryDeduction(deductionId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<SalaryDeductionResultSet> _getAllSalaryDeductionsByFilter(
            Integer employeeId, SalaryTypes salaryType,
            LocalDate deductionDateFrom, LocalDate deductionDateTo,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        SalaryDeductionResultSet result = salaryDeductionService.getAllSalaryDeductionsByFilter(
                employeeId, salaryType, deductionDateFrom, deductionDateTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<SalaryDeductionVTO> _getSalaryDeductionById(Integer deductionId) {
        SalaryDeductionVTO result = salaryDeductionService.getSalaryDeductionById(deductionId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateSalaryDeduction(Integer deductionId, SalaryDeductionDTO salaryDeductionDTO) {
        NewRecordVTO result = salaryDeductionService.updateSalaryDeduction(deductionId, salaryDeductionDTO);
        return ResponseEntity.ok(result);
    }
}