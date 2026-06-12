package bs.service.financial.core.service;

import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.model.entity.Employee;
import bs.service.financial.api.repository.SalaryDeductionRepository;
import bs.service.financial.api.service.SalaryDeductionService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.salary.deduction.SalaryDeduction;
import bs.service.financial.model.filter.SalaryDeductionSearchFilter;
import bs.service.financial.model.generated.SalaryDeductionDTO;
import bs.service.financial.model.generated.SalaryDeductionResultSet;
import bs.service.financial.model.generated.SalaryDeductionVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.*;

@Service
@AllArgsConstructor
public class SalaryDeductionServiceImpl implements SalaryDeductionService {

    private final SalaryDeductionRepository salaryDeductionRepository;
    private final EmployeeRepository employeeRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createSalaryDeduction(SalaryDeductionDTO salaryDeductionDTO) {
        Employee employee = employeeRepository.selectById(salaryDeductionDTO.getEmployeeId())
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND_FOR_SALARY, salaryDeductionDTO.getEmployeeId()));

        if (salaryDeductionDTO.getAmountDeducted() > employee.getRemainedSalary()) {
            throw new BusinessException(DEDUCTION_AMOUNT_EXCEEDS_SALARY);
        }

        SalaryDeduction deduction = financialMapper.toSalaryDeduction(salaryDeductionDTO);
        deduction.setEmployee(employee);
        deduction = salaryDeductionRepository.insert(deduction);

        // Update employee remained salary
        employee.setRemainedSalary(employee.getRemainedSalary() - deduction.getAmountDeducted());
        employeeRepository.update(employee);

        return NewRecordVTO.builder().id(deduction.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateSalaryDeduction(Integer deductionId, SalaryDeductionDTO salaryDeductionDTO) {
        SalaryDeduction deduction = salaryDeductionRepository.selectById(deductionId)
                .orElseThrow(() -> new BusinessException(SALARY_DEDUCTION_NOT_FOUND, deductionId));

        SalaryDeduction deductionToUpdate = financialMapper.toSalaryDeduction(salaryDeductionDTO);
        deductionToUpdate.setId(deductionId);
        salaryDeductionRepository.update(deductionToUpdate);
        return NewRecordVTO.builder().id(deductionId).build();
    }

    @Override
    @Transactional
    public void deleteSalaryDeduction(Integer deductionId) {
        SalaryDeduction deduction = salaryDeductionRepository.selectById(deductionId)
                .orElseThrow(() -> new BusinessException(SALARY_DEDUCTION_NOT_FOUND, deductionId));
        deduction.setIsDeleted(true);
        salaryDeductionRepository.update(deduction);
    }

    @Override
    public SalaryDeductionVTO getSalaryDeductionById(Integer deductionId) {
        SalaryDeduction deduction = salaryDeductionRepository.selectById(deductionId)
                .orElseThrow(() -> new BusinessException(SALARY_DEDUCTION_NOT_FOUND, deductionId));
        return financialMapper.toSalaryDeductionVTO(deduction);
    }

    @Override
    public SalaryDeductionResultSet getAllSalaryDeductionsByFilter(Integer employeeId, SalaryTypes salaryType,
                                                                   LocalDate deductionDateFrom, LocalDate deductionDateTo,
                                                                   Integer pageNum, Integer pageSize,
                                                                   OrderDirections orderDir, String orderBy) {
        SalaryDeductionSearchFilter filter = SalaryDeductionSearchFilter.builder()
                .employeeId(employeeId)
                .salaryType(salaryType!=null? salaryType.id:null)
                .deductionDateFrom(deductionDateFrom)
                .deductionDateTo(deductionDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(SalaryDeductionSearchFilter.OrderByAttributes.DEDUCTION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<SalaryDeduction> deductions = salaryDeductionRepository.selectAllByFilters(filter);
        List<SalaryDeductionVTO> items = financialMapper.toSalaryDeductionVTOs(deductions);

        return SalaryDeductionResultSet.builder()
                .items(items)
                .total(items.size())
                .build();
    }
}