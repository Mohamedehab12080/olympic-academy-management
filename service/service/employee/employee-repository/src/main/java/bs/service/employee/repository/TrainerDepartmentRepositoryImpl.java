package bs.service.employee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.employee.api.repository.TrainerDepartmentRepository;
import bs.service.employee.model.entity.EmployeeDepartment;
import bs.service.employee.model.filter.TrainerDepartmentSearchFilter;
import bs.service.employee.repository.jpa.EmployeeDepartmentJPARepository;
import bs.service.employee.repository.query.TrainerDepartmentQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class TrainerDepartmentRepositoryImpl implements TrainerDepartmentRepository {

    private final EmployeeDepartmentJPARepository employeeDepartmentJPARepository;
    private final TrainerDepartmentQueryBuilder trainerDepartmentQueryBuilder;
    private final SecurityUtilsService securityUtilsService;

    @Override
    public EmployeeDepartment insert(EmployeeDepartment employeeDepartment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employeeDepartment.setCreatedOn(LocalDateTime.now());
        employeeDepartment.setCreatedBy(currentUser);
        return employeeDepartmentJPARepository.save(employeeDepartment);
    }

    @Override
    public EmployeeDepartment update(EmployeeDepartment employeeDepartment) {
        return employeeDepartmentJPARepository.save(employeeDepartment);
    }

    @Override
    public void delete(Integer employeeDepartmentId) {
        employeeDepartmentJPARepository.deleteById(employeeDepartmentId);
    }

    @Override
    public Optional<EmployeeDepartment> selectById(Integer id) {
        return employeeDepartmentJPARepository.findById(id);
    }

    @Override
    public List<EmployeeDepartment> selectAllByFilters(TrainerDepartmentSearchFilter filters) {
        return trainerDepartmentQueryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(TrainerDepartmentSearchFilter filters) {
        return trainerDepartmentQueryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer id) {
        employeeDepartmentJPARepository.deleteById(id);
    }
}
