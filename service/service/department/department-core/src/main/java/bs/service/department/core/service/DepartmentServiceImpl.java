package bs.service.department.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
import bs.service.course.model.entity.Course;
import bs.service.course.model.filter.CourseSearchFilter;
import bs.service.department.api.repository.DepartmentReportRepository;
import bs.service.department.api.repository.DepartmentRepository;
import bs.service.department.api.service.DepartmentService;
import bs.service.department.core.mapper.DepartmentMapper;
import bs.service.department.model.entity.Department;
import bs.service.department.model.filter.DepartmentSearchFilter;
import bs.service.department.model.generated.DepartmentDTO;
import bs.service.department.model.generated.DepartmentListItem;
import bs.service.department.model.generated.DepartmentResultSet;
import bs.service.department.model.generated.DepartmentVTO;
import bs.service.employee.api.repository.TrainerDepartmentRepository;
import bs.service.employee.model.entity.EmployeeDepartment;
import bs.service.employee.model.filter.TrainerDepartmentSearchFilter;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import static bs.service.department.model.enums.DepartmentErrors.DEPARTMENT_ALREADY_EXIST;
import static bs.service.department.model.enums.DepartmentErrors.DEPARTMENT_NOT_FOUND;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;
    private final TrainerDepartmentRepository trainerDepartmentRepository;
    private final CourseRepository courseRepository;
    private final DepartmentReportRepository departmentReportRepository;

    @Override
    @Transactional
    public NewRecordVTO create(DepartmentDTO departmentDTO) {
        Department department =departmentMapper.toDepartment(departmentDTO);
        DepartmentSearchFilter departmentSearchFilter=DepartmentSearchFilter.builder()
                .quickSearchQuery(departmentDTO.getTitle())
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Department> departments=departmentRepository.selectAllByFilters(departmentSearchFilter);
        if(departments!=null && !departments.isEmpty()) {
            throw new BusinessException(DEPARTMENT_ALREADY_EXIST,department.getTitle());
        }
        department=departmentRepository.insert(department);
        return NewRecordVTO.builder().id(department.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO update(Integer departmentId, DepartmentDTO departmentDTO) {
        Department department =departmentRepository.selectDepartmentById(departmentId).orElseThrow(()-> new BusinessException(DEPARTMENT_NOT_FOUND,departmentId));
        Department departmentToUpdate=departmentMapper.toDepartment(departmentDTO);
        departmentToUpdate.setId(departmentId);
        departmentToUpdate.setCreatedBy(department.getCreatedBy());
        departmentToUpdate.setCreatedOn(department.getCreatedOn());
        departmentRepository.update(departmentToUpdate);
        return NewRecordVTO.builder().id(departmentId).build();
    }

    @Override
    public DepartmentVTO getDepartmentDetailsById(Integer id,LocalDate from , LocalDate to) {
        return departmentReportRepository.getDepartmentReport(id,from,to);
    }

    @Override
    public DepartmentVTO getDepartmentById(Integer id) {
        Department department=departmentRepository.selectDepartmentById(id).orElseThrow(()-> new BusinessException(DEPARTMENT_NOT_FOUND));
        DepartmentVTO departmentVTO=departmentMapper.toDepartmentVTO(department);
        return departmentVTO;
    }

    @Override
    public Boolean existsById(Integer id) {
        Department department=departmentRepository.selectDepartmentById(id).orElseThrow(()-> new BusinessException(DEPARTMENT_NOT_FOUND));
        return true;
    }

    @Override
    public DepartmentResultSet selectAllDepartmentsByFilters(String quickSearch, LocalDate createdOnFrom, LocalDate createdOnTo, LocalDate lastModifiedOnFrom, LocalDate lastModifiedOnTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        DepartmentSearchFilter departmentSearchFilter=DepartmentSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .createdOnFrom(createdOnFrom)
                .createdOnTo(createdOnTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(DepartmentSearchFilter.OrderByAttributes.CREATION_DATE,OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy,orderDir))
                .build();
        List<Department> departments=departmentRepository.selectAllByFilters(departmentSearchFilter);
        List<DepartmentListItem> listItems=departmentMapper.toDepartmentListItems(departments);
        return DepartmentResultSet.builder().items(listItems).total(listItems.size()).build();
    }

    @Override
    @Transactional
    public void deleteDepartmentById(Integer id) {
        Department department =departmentRepository.selectDepartmentById(id).orElseThrow(()-> new BusinessException(DEPARTMENT_NOT_FOUND,id));
        TrainerDepartmentSearchFilter trainerDepartmentSearchFilter=TrainerDepartmentSearchFilter
                .builder()
                .departmentId(id)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<EmployeeDepartment>employeeDepartments=trainerDepartmentRepository.selectAllByFilters(trainerDepartmentSearchFilter);
        if(employeeDepartments!=null && !employeeDepartments.isEmpty()) {
            for (EmployeeDepartment employeeDepartment : employeeDepartments) {
                trainerDepartmentRepository.deleteById(employeeDepartment.getId());
            }
        }
        CourseSearchFilter courseSearchFilter= CourseSearchFilter.builder()
                .departmentId(id)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Course> courses=courseRepository.selectAllByFilter(courseSearchFilter);
        if(courses!=null && !courses.isEmpty()) {
            department.setIsDeleted(true);
            departmentRepository.update(department);
            return;
        }
        departmentRepository.deleteById(id);
    }

    @Override
    public LookupResultSet getAllDepartments() {
        DepartmentSearchFilter departmentSearchFilter=DepartmentSearchFilter.builder()
                .isActive(true)
                .isDeleted(false)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<LookupVTO> lookupVTOS=departmentMapper.toLookupVTOs(departmentRepository.selectAllByFilters(departmentSearchFilter));
        return LookupResultSet.builder()._list(lookupVTOS).total(lookupVTOS.size()).build();
    }
}
