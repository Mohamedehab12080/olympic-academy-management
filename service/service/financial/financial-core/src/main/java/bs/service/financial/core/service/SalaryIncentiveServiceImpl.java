package bs.service.financial.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.model.entity.Employee;
import bs.service.financial.api.repository.SalaryIncentiveRepository;
import bs.service.financial.api.service.SalaryIncentiveService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.salary.incentive.SalaryIncentive;
import bs.service.financial.model.enums.SalaryTransactionType;
import bs.service.financial.model.filter.SalaryIncentiveSearchFilter;
import bs.service.financial.model.generated.SalaryIncentiveDTO;
import bs.service.financial.model.generated.SalaryIncentiveResultSet;
import bs.service.financial.model.generated.SalaryIncentiveVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.*;

@Service
@AllArgsConstructor
public class SalaryIncentiveServiceImpl implements SalaryIncentiveService {

    private final SalaryIncentiveRepository salaryIncentiveRepository;
    private final EmployeeRepository employeeRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createSalaryIncentive(SalaryIncentiveDTO salaryIncentiveDTO) {
        Employee employee = employeeRepository.selectById(salaryIncentiveDTO.getEmployeeId())
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND_FOR_SALARY, salaryIncentiveDTO.getEmployeeId()));

        SalaryIncentive incentive = financialMapper.toSalaryIncentive(salaryIncentiveDTO);
        incentive.setEmployee(employee);

        // Update employee remained salary
        if (salaryIncentiveDTO.getSalaryTransactionType() == SalaryTransactionType.SALARY) {
            if (employee.getRemainedSalary() < salaryIncentiveDTO.getAmountWithdrawn()) {
                throw new BusinessException(INSUFFICIENT_REMAINED_SALARY);
            }
            employee.setRemainedSalary(employee.getRemainedSalary() - salaryIncentiveDTO.getAmountWithdrawn());
        }

        employeeRepository.update(employee);
        incentive = salaryIncentiveRepository.insert(incentive);

        return NewRecordVTO.builder().id(incentive.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateSalaryIncentive(Integer transactionId, SalaryIncentiveDTO salaryIncentiveDTO) {
        SalaryIncentive incentive = salaryIncentiveRepository.selectById(transactionId)
                .orElseThrow(() -> new BusinessException(SALARY_INCENTIVE_NOT_FOUND, transactionId));

        SalaryIncentive incentiveToUpdate = financialMapper.toSalaryIncentive(salaryIncentiveDTO);
        incentiveToUpdate.setId(transactionId);
        salaryIncentiveRepository.update(incentiveToUpdate);
        return NewRecordVTO.builder().id(transactionId).build();
    }

    @Override
    @Transactional
    public void deleteSalaryIncentive(Integer transactionId) {
        SalaryIncentive incentive = salaryIncentiveRepository.selectById(transactionId)
                .orElseThrow(() -> new BusinessException(SALARY_INCENTIVE_NOT_FOUND, transactionId));
        incentive.setIsDeleted(true);
        salaryIncentiveRepository.update(incentive);
    }

    @Override
    public SalaryIncentiveVTO getSalaryIncentiveById(Integer transactionId) {
        SalaryIncentive incentive = salaryIncentiveRepository.selectById(transactionId)
                .orElseThrow(() -> new BusinessException(SALARY_INCENTIVE_NOT_FOUND, transactionId));
        return financialMapper.toSalaryIncentiveVTO(incentive);
    }

    @Override
    public SalaryIncentiveResultSet getAllSalaryIncentivesByFilter(Integer employeeId, Integer paymentMethodId,
                                                                   SalaryTransactionType type, LocalDate withdrawDateFrom,
                                                                   LocalDate withdrawDateTo, Integer pageNum,
                                                                   Integer pageSize, OrderDirections orderDir,
                                                                   String orderBy) {
        SalaryIncentiveSearchFilter filter = SalaryIncentiveSearchFilter.builder()
                .employeeId(employeeId)
                .paymentMethodId(paymentMethodId)
                .type(type)
                .withdrawDateFrom(withdrawDateFrom)
                .withdrawDateTo(withdrawDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(SalaryIncentiveSearchFilter.OrderByAttributes.WITHDRAW_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<SalaryIncentive> incentives = salaryIncentiveRepository.selectAllByFilters(filter);
        List<SalaryIncentiveVTO> items = financialMapper.toSalaryIncentiveVTOs(incentives);

        return SalaryIncentiveResultSet.builder()
                .items(items)
                .total(items.size())
                .build();
    }
}