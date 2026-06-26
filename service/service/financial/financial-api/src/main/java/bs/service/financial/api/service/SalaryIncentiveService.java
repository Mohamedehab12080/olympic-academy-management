package bs.service.financial.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.enums.SalaryTransactionType;
import bs.service.financial.model.generated.SalaryIncentiveDTO;
import bs.service.financial.model.generated.SalaryIncentiveResultSet;
import bs.service.financial.model.generated.SalaryIncentiveVTO;

import java.time.LocalDate;

public interface SalaryIncentiveService {
    NewRecordVTO createSalaryIncentive(SalaryIncentiveDTO salaryIncentiveDTO);
    NewRecordVTO updateSalaryIncentive(Integer transactionId, SalaryIncentiveDTO salaryIncentiveDTO);
    void deleteSalaryIncentive(Integer transactionId);
    SalaryIncentiveVTO getSalaryIncentiveById(Integer transactionId);
    SalaryIncentiveResultSet getAllSalaryIncentivesByFilter(Integer employeeId,String employeeNationalId, Integer paymentMethodId,
                                                            SalaryTransactionType type, LocalDate withdrawDateFrom,
                                                            LocalDate withdrawDateTo,String quickSearch, Integer pageNum,
                                                            Integer pageSize, OrderDirections orderDir,
                                                            String orderBy);
}