package bs.service.financial.api.service;

import bs.service.financial.model.generated.FinancialTotalVTO;

import java.time.LocalDate;

public interface FinancialTotalService{

    FinancialTotalVTO getFinancialTotalVTO(LocalDate startDate, LocalDate endDate);
}
