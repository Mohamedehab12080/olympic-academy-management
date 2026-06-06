package bs.service.department.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.department.api.repository.DepartmentRepository;
import bs.service.department.api.service.DepartmentService;
import bs.service.department.core.mapper.DepartmentMapper;
import bs.service.department.model.entity.Department;
import bs.service.department.model.filter.DepartmentSearchFilter;
import bs.service.department.model.generated.DepartmentDTO;
import bs.service.department.model.generated.DepartmentListItem;
import bs.service.department.model.generated.DepartmentResultSet;
import bs.service.department.model.generated.DepartmentVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.department.model.enums.DepartmentErrors.DEPARTMENT_NOT_FOUND;

@Service
@AllArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {
    private final DepartmentRepository departmentRepository;
    private final DepartmentMapper departmentMapper;

    @Override
    @Transactional
    public NewRecordVTO create(DepartmentDTO departmentDTO) {
        Department department =departmentMapper.toDepartment(departmentDTO);
        department=departmentRepository.insert(department);
        return NewRecordVTO.builder().id(department.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO update(Integer departmentId, DepartmentDTO departmentDTO) {
        Department department =departmentRepository.selectDepartmentById(departmentId).orElseThrow(()-> new BusinessException(DEPARTMENT_NOT_FOUND,departmentId));
        Department departmentToUpdate=departmentMapper.toDepartment(departmentDTO);
        departmentToUpdate.setId(departmentId);
        departmentRepository.update(departmentToUpdate);
        return NewRecordVTO.builder().id(departmentId).build();
    }

    @Override
    public DepartmentVTO getDepartmentById(Integer id) {
        Department department =departmentRepository.selectDepartmentById(id).orElseThrow(()-> new BusinessException(DEPARTMENT_NOT_FOUND,id));
        DepartmentVTO departmentVTO = departmentMapper.toDepartmentVTO(department);
        return departmentVTO;
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
        department.setIsDeleted(true);
        departmentRepository.update(department);
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
