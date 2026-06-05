package bs.service.financial.api.service;

import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.SalaryDeductionDTO;
import bs.service.financial.model.generated.SalaryDeductionResultSet;
import bs.service.financial.model.generated.SalaryDeductionVTO;

import java.time.LocalDate;

public interface SalaryDeductionService {
    NewRecordVTO createSalaryDeduction(SalaryDeductionDTO salaryDeductionDTO);
    NewRecordVTO updateSalaryDeduction(Integer deductionId, SalaryDeductionDTO salaryDeductionDTO);
    void deleteSalaryDeduction(Integer deductionId);
    SalaryDeductionVTO getSalaryDeductionById(Integer deductionId);
    SalaryDeductionResultSet getAllSalaryDeductionsByFilter(Integer employeeId, SalaryTypes salaryType,
                                                            LocalDate deductionDateFrom, LocalDate deductionDateTo,
                                                            Integer pageNum, Integer pageSize,
                                                            OrderDirections orderDir, String orderBy);
}