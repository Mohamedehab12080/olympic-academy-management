package bs.service.financial.controller;

import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.SalaryIncentiveService;
import bs.service.financial.controller.generated.SalaryIncentiveController;
import bs.service.financial.model.enums.SalaryTransactionType;
import bs.service.financial.model.generated.SalaryIncentiveDTO;
import bs.service.financial.model.generated.SalaryIncentiveResultSet;
import bs.service.financial.model.generated.SalaryIncentiveVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class SalaryIncentiveControllerImpl implements SalaryIncentiveController {

    private final SalaryIncentiveService salaryIncentiveService;

    @Override
    public ResponseEntity<NewRecordVTO> _createSalaryIncentive(SalaryIncentiveDTO salaryIncentiveDTO) {
        NewRecordVTO result = salaryIncentiveService.createSalaryIncentive(salaryIncentiveDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteSalaryIncentive(Integer transactionId) {
        salaryIncentiveService.deleteSalaryIncentive(transactionId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<SalaryIncentiveResultSet> _getAllSalaryIncentivesByFilter(
            Integer employeeId, Integer paymentMethodId, SalaryTypes salaryType,
            SalaryTransactionType type, LocalDate withdrawDateFrom, LocalDate withdrawDateTo,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        SalaryIncentiveResultSet result = salaryIncentiveService.getAllSalaryIncentivesByFilter(
                employeeId, paymentMethodId, type, withdrawDateFrom, withdrawDateTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<SalaryIncentiveVTO> _getSalaryIncentiveById(Integer transactionId) {
        SalaryIncentiveVTO result = salaryIncentiveService.getSalaryIncentiveById(transactionId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateSalaryIncentive(Integer transactionId, SalaryIncentiveDTO salaryIncentiveDTO) {
        NewRecordVTO result = salaryIncentiveService.updateSalaryIncentive(transactionId, salaryIncentiveDTO);
        return ResponseEntity.ok(result);
    }
}