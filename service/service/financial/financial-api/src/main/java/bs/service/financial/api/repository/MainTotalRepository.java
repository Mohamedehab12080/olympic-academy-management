package bs.service.financial.api.repository;

import bs.service.financial.model.generated.FinancialTotalVTO;


public interface MainTotalRepository {
    FinancialTotalVTO findMainFinancialTotalVTO(String year);
}
