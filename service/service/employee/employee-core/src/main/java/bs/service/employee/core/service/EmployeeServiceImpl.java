package bs.service.employee.core.service;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.service.EmployeeService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.filter.EmployeeSearchFilter;
import bs.service.employee.model.generated.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import static bs.service.employee.model.enums.EmployeeErrors.EMPLOYEE_CONTACT_NOT_FOUND;
import static bs.service.employee.model.enums.EmployeeErrors.EMPLOYEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public NewRecordVTO createEmployee(EmployeeDTO employeeDTO) {
        Employee employee = employeeMapper.toEmployee(employeeDTO);
        employee = employeeRepository.insert(employee);
        return NewRecordVTO.builder().id(employee.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEmployee(Integer employeeId, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        Employee employeeToUpdate = employeeMapper.toEmployee(employeeDTO);
        employeeToUpdate.setId(employeeId);
        employeeRepository.update(employeeToUpdate);
        return NewRecordVTO.builder().id(employeeId).build();
    }

    @Override
    @Transactional
    public void deleteEmployeeById(Integer employeeId) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        employee.setIsDeleted(true);
        employeeRepository.update(employee);
    }

    @Override
    public EmployeeVTO getEmployeeById(Integer employeeId) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        return employeeMapper.toEmployeeVTO(employee);
    }

    @Override
    public EmployeeResultSet getAllEmployees(String quickSearch, Boolean isActive,
                                             LocalDate createdOnFrom, LocalDate createdOnTo,
                                             LocalDate hireDateFrom, LocalDate hireDateTo,
                                             Gender gender, EmployeeTypes employeeType,
                                             SalaryTypes salaryType, Integer pageNum, Integer pageSize,
                                             OrderDirections orderDir, String orderBy) {

        EmployeeSearchFilter employeeSearchFilter = EmployeeSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .isActive(isActive)
                .createdOnFrom(createdOnFrom)
                .createdOnTo(createdOnTo)
                .hireDateFrom(hireDateFrom)
                .hireDateTo(hireDateTo)
                .gender(gender.title)
                .employeeType(employeeType.title)
                .salaryType(salaryType)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EmployeeSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<Employee> employees = employeeRepository.selectAllByFilters(employeeSearchFilter);
        List<EmployeeListItem> listItems = employeeMapper.toEmployeeListItems(employees);
        return EmployeeResultSet.builder()
                .items(listItems)
                .total(employeeRepository.countAllByFilters(employeeSearchFilter))
                .build();
    }

    @Override
    public LookupResultSet getAllEmployeesLookup() {
        EmployeeSearchFilter employeeSearchFilter=EmployeeSearchFilter.builder()
                .isActive(true)
                .isDeleted(false)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Employee> employees=employeeRepository.selectAllByFilters(employeeSearchFilter);
        List<LookupVTO> lookupVTOS=employeeMapper.toLookupVTOs(employees);
        return LookupResultSet.builder()._list(lookupVTOS).total(employeeRepository.countAllByFilters(employeeSearchFilter)).build();
    }

    @Override
    public LookupResultSet getAllEmployeeTypesLookup() {
        List<LookupVTO> lookupVTOS=employeeMapper.toLookupEmployeeTypesVTOs(List.of(EmployeeTypes.values()));
        return LookupResultSet.builder()._list(lookupVTOS).total(lookupVTOS.size()).build();
    }

    @Override
    public LookupResultSet getAllEmployeeAttendanceStatusLookup() {
        List<LookupVTO> lookupVTOS=employeeMapper.toLookupEmployeeAttendanceStatusVTOs(List.of(EmployeeAttendanceStatus.values()));
        return LookupResultSet.builder()._list(lookupVTOS).total(lookupVTOS.size()).build();
    }
}