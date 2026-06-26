package bs.service.financial.core.service;

import bs.service.financial.api.repository.FinancialTotalRepository;
import bs.service.financial.api.repository.MainTotalRepository;
import bs.service.financial.api.service.FinancialTotalService;
import bs.service.financial.model.generated.FinancialTotalVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class FinancialTotalServiceImpl implements FinancialTotalService {

    private final FinancialTotalRepository financialTotalRepository;
    private final MainTotalRepository mainRepository;

    @Override
    public FinancialTotalVTO getFinancialTotalVTO(LocalDate startDate, LocalDate endDate) {
        return financialTotalRepository.findFinancialTotalVTO(startDate, endDate);
    }

    @Override
    public FinancialTotalVTO getMainFinancialTotalVTO(String year) {
        return mainRepository.findMainFinancialTotalVTO(year);
    }
}
