package bs.service.department.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.department.api.repository.DepartmentRepository;
import bs.service.department.model.entity.Department;
import bs.service.department.model.filter.DepartmentSearchFilter;
import bs.service.department.repository.jpa.DepartmentJPARepository;
import bs.service.department.repository.query.DepartmentQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class DepartmentRepositoryImpl implements DepartmentRepository {

    private final DepartmentJPARepository departmentJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final DepartmentQueryBuilder queryBuilder;

    @Override
    public Department insert(Department department) {
        User currentUser=User.builder().id(securityUtilsService.getCurrentUserId()).build();
        department.setCreatedBy(currentUser);
        department.setCreatedOn(LocalDateTime.now());
        department.setIsActive(true);
        department.setIsDeleted(false);
        return departmentJPARepository.save(department);
    }

    @Override
    public Department update(Department department) {
        User currentUser=User.builder().id(securityUtilsService.getCurrentUserId()).build();
        department.setLastModifiedBy(currentUser);
        department.setLastModifiedOn(LocalDateTime.now());
        return departmentJPARepository.save(department);
    }

    @Override
    public Optional<Department> selectDepartmentById(Integer id) {
        return departmentJPARepository.findById(id);
    }

    @Override
    public List<Department> selectDepartmentByIdIn(List<Integer> ids) {
        return departmentJPARepository.findAllById(ids);
    }

    @Override
    public List<Department> selectAllByFilters(DepartmentSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(DepartmentSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer id) {
        departmentJPARepository.deleteById(id);
    }

}
