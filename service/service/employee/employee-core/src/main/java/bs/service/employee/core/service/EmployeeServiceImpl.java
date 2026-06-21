package bs.service.employee.core.service;

import bs.lib.common.api.service.ValidateService;
import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.model.entity.Course;
import bs.service.department.model.entity.Department;
import bs.service.employee.api.repository.CourseSessionRepository;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.repository.TrainerCourseRepository;
import bs.service.employee.api.repository.TrainerDepartmentRepository;
import bs.service.employee.api.service.EmployeeService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.*;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.enums.EmployeeDomains;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.filter.CourseSessionSearchFilter;
import bs.service.employee.model.filter.EmployeeSearchFilter;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;
import bs.service.employee.model.filter.TrainerDepartmentSearchFilter;
import bs.service.employee.model.generated.*;
import bs.service.file.api.service.FileService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import static bs.service.employee.model.enums.EmployeeErrors.*;

@Service
@AllArgsConstructor
public class EmployeeServiceImpl implements EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final EmployeeMapper employeeMapper;
    private final TrainerCourseRepository trainerCourseRepository;
    private final FileService fileService;
    private final TrainerDepartmentRepository trainerDepartmentRepository;
    private final CourseSessionRepository courseSessionRepository;
    private final ValidateService validateService;

    @Override
    @Transactional
    public NewRecordVTO createEmployee(EmployeeDTO employeeDTO) {
        EmployeeSearchFilter employeeSearchFilter=EmployeeSearchFilter.builder().pagination(PaginationInfo.noPagination()).isDeleted(false).quickSearchQuery(employeeDTO.getNationalId()).build();
        List<Employee> employees=employeeRepository.selectAllByFilters(employeeSearchFilter);
        if(employees!=null && !employees.isEmpty()){
            throw new BusinessException(NATIONAL_ID_ALREADY_EXISTS,employeeDTO.getNationalId());
        }
        Employee employee = employeeMapper.toEmployee(employeeDTO);
        employee.setIsActive(true);
        employee.setIsDeleted(false);
        employee = employeeRepository.insert(employee);
        fileService.updateFileUsage(EmployeeDomains.EMPLOYEE.id(),String.valueOf(employee.getId()), Collections.singletonList(employee.getImageUrl()));
        return NewRecordVTO.builder().id(employee.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEmployee(Integer employeeId, EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        Employee employeeToUpdate = employeeMapper.toEmployee(employeeDTO);
        employeeToUpdate.setId(employeeId);
        employeeToUpdate.setIsActive(employeeDTO.getIsActive());
        employeeToUpdate.setIsDeleted(false);
        fileService.updateFileUsage(EmployeeDomains.EMPLOYEE.id(),String.valueOf(employeeToUpdate.getId()), Collections.singletonList(employeeToUpdate.getImageUrl()));
        employeeRepository.update(employeeToUpdate);
        return NewRecordVTO.builder().id(employeeId).build();
    }

    @Override
    @Transactional
    public void deleteEmployeeById(Integer employeeId) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        employee.setIsDeleted(true);
        fileService.deleteByFid(employee.getImageUrl());
        employeeRepository.update(employee);
    }

    @Override
    public EmployeeVTO getEmployeeById(Integer employeeId) {
        Employee employee = employeeRepository.selectById(employeeId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, employeeId));
        TrainerCourseSearchFilter trainerCourseSearchFilter=TrainerCourseSearchFilter.builder()
                .trainerId(employeeId)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<TrainerCourse> trainerCourses=trainerCourseRepository.selectAllByFilters(trainerCourseSearchFilter);
        List<Course> courses=trainerCourses.stream().map(TrainerCourse::getCourse).toList();
        List<LookupVTO> lookupVTOs=employeeMapper.toLookupCourseVTOs(courses);
        TrainerDepartmentSearchFilter trainerDepartmentSearchFilter=TrainerDepartmentSearchFilter.builder().trainerId(employeeId).build();
        List<EmployeeDepartment> employeeDepartments=trainerDepartmentRepository.selectAllByFilters(trainerDepartmentSearchFilter);
        List<Department> departments=employeeDepartments.stream().map(EmployeeDepartment::getDepartment).toList();
        List<LookupVTO> departmentLookupVTOs=employeeMapper.toDepartmentLookupVTOs(departments);
        EmployeeVTO employeeVTO= employeeMapper.toEmployeeVTO(employee);
        employeeVTO.setDepartments(departmentLookupVTOs);
        employeeVTO.setCourses(lookupVTOs);
        CourseSessionSearchFilter courseSessionSearchFilter=CourseSessionSearchFilter.builder().employeeId(employeeId).build();
        List<CourseSession> courseSessions=courseSessionRepository.selectAllByFilters(courseSessionSearchFilter);
        List<CourseSessionVTO> courseSessionVTOS=employeeMapper.toCourseSessionVTOs(courseSessions);
        employeeVTO.setSessions(courseSessionVTOS);
        return employeeVTO;
    }

    @Override
    public EmployeeResultSet getAllEmployees(String quickSearch, Boolean isActive,
                                             LocalDate createdOnFrom, LocalDate createdOnTo,
                                             LocalDate hireDateFrom, LocalDate hireDateTo,
                                             Gender gender, EmployeeTypes employeeType,
                                             SalaryTypes salaryType, Integer pageNum, Integer pageSize,
                                             OrderDirections orderDir, String orderBy) {
        validateService.validateFromToFilters(hireDateFrom,hireDateTo);
        validateService.validateFromToFilters(createdOnFrom,createdOnTo);

        EmployeeSearchFilter employeeSearchFilter = EmployeeSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .isActive(isActive)
                .createdOnFrom(createdOnFrom)
                .createdOnTo(createdOnTo)
                .hireDateFrom(hireDateFrom)
                .hireDateTo(hireDateTo)
                .gender(gender!=null ? gender.title :null)
                .employeeTypeId(employeeType!=null ? employeeType.id:null)
                .salaryType(salaryType!=null?salaryType.id:null)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EmployeeSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<Employee> employees = employeeRepository.selectAllByFilters(employeeSearchFilter);
        List<EmployeeListItem> listItems = employees.stream().map(emp-> {
            EmployeeListItem employeeListItem= employeeMapper.toEmployeeListItem(emp);
            employeeListItem.setImageUrl(emp.getImageUrl());
            return employeeListItem;
        }).toList();
        System.out.println("Employess : "+Arrays.toString(listItems.toArray()));
        return EmployeeResultSet.builder()
                .items(listItems)
                .total(listItems.size())
                .build();
    }

    @Override
    public List<EmployeeLookupVTO> getAllEmployeesLookup() {
        EmployeeSearchFilter employeeSearchFilter=EmployeeSearchFilter.builder()
                .isActive(true)
                .isDeleted(false)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Employee> employees=employeeRepository.selectAllByFilters(employeeSearchFilter);
        List<EmployeeLookupVTO> lookupVTOS=employeeMapper.toEmployeeLookupVTOs(employees);
        return lookupVTOS;
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

    @Override
    public LookupResultSet getAllTrainersLookup() {
        EmployeeSearchFilter trainerSearchFilter=EmployeeSearchFilter.builder()
                .isActive(true)
                .isDeleted(false)
                .employeeTypeId(EmployeeTypes.TRAINER.id)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Employee> employees=employeeRepository.selectAllByFilters(trainerSearchFilter);
        List<LookupVTO> lookupVTOS=employeeMapper.toLookupVTOs(employees);
        return LookupResultSet.builder()._list(lookupVTOS).total(lookupVTOS.size()).build();
    }
}