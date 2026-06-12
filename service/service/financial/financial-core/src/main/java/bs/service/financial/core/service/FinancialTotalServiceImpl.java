package bs.service.financial.core.service;

import bs.service.financial.api.repository.FinancialTotalRepository;
import bs.service.financial.api.service.FinancialTotalService;
import bs.service.financial.model.generated.FinancialTotalVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@AllArgsConstructor
public class FinancialTotalServiceImpl implements FinancialTotalService {

    private final FinancialTotalRepository repository;

    @Override
    public FinancialTotalVTO getFinancialTotalVTO(LocalDate startDate, LocalDate endDate) {
        return repository.findFinancialTotalVTO(startDate, endDate);
    }
}
