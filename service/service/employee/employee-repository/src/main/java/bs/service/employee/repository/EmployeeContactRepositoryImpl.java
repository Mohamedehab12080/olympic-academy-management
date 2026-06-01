package bs.service.employee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.employee.api.repository.EmployeeContactRepository;
import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.filter.EmployeeContactSearchFilter;
import bs.service.employee.repository.jpa.EmployeeContactJPARepository;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class EmployeeContactRepositoryImpl implements EmployeeContactRepository {

    private final EmployeeContactJPARepository employeeContactJPARepository;
    private final SecurityUtilsService securityUtilsService;

    @Override
    public EmployeeContact insert(EmployeeContact employeeContact) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employeeContact.setCreatedOn(LocalDateTime.now());
        employeeContact.setCreatedBy(currentUser);
        return employeeContactJPARepository.save(employeeContact);
    }

    @Override
    public EmployeeContact update(EmployeeContact employeeContact){
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        employeeContact.setLastModifiedOn(LocalDateTime.now());
        employeeContact.setLastModifiedBy(currentUser);
        return employeeContactJPARepository.save(employeeContact);
    }

    @Override
    public void delete(Integer employeeContactId) {
        employeeContactJPARepository.deleteById(employeeContactId);
    }

    @Override
    public Optional<EmployeeContact> selectById(Integer id) {
        return employeeContactJPARepository.findById(id);
    }

    @Override
    public List<EmployeeContact> selectAllByFilters(EmployeeContactSearchFilter filters) {
        return List.of();
    }

    @Override
    public Integer countAllByFilters(EmployeeContactSearchFilter filters) {
        return 0;
    }
}
