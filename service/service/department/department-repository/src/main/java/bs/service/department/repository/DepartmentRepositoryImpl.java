package bs.service.department.repository;

import bs.olympic.common.security.api.service.SecurityUtilsService;
import bs.olympic.department.api.repository.DepartmentRepository;
import bs.olympic.department.model.entity.Department;
import bs.olympic.department.model.filter.DepartmentSearchFilter;
import bs.olympic.department.repository.jpa.DepartmentJPARepository;
import bs.olympic.department.repository.query.DepartmentQueryBuilder;
import bs.olympic.user.model.entity.User;
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
    public Optional<Department> getDepartmentById(Integer id) {
        return departmentJPARepository.findById(id);
    }

    @Override
    public List<Department> selectAllByFilters(DepartmentSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Long countAllByFilters(DepartmentSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

}
