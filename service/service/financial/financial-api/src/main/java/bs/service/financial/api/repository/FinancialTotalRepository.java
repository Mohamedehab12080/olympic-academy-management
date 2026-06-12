package bs.service.financial.api.repository;

import bs.service.financial.model.generated.FinancialTotalVTO;

import java.time.LocalDate;

public interface FinancialTotalRepository {

    FinancialTotalVTO findFinancialTotalVTO(LocalDate from, LocalDate to);

}
