package bs.service.financial.controller;

import bs.service.financial.api.service.FinancialTotalService;
import bs.service.financial.controller.generated.ReportController;
import bs.service.financial.model.generated.FinancialTotalVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class ReportControllerImpl implements ReportController {

    private final FinancialTotalService financialTotalService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<FinancialTotalVTO> _getAllTotalsOfFinancials(LocalDate totalDateFrom, LocalDate totalDateTo) {
        return ResponseEntity.ok(financialTotalService.getFinancialTotalVTO(totalDateFrom, totalDateTo));
    }
}
