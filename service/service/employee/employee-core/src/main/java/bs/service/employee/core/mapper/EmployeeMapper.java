package bs.service.employee.core.mapper;


import bs.lib.common.model.enums.ContactTypes;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.department.model.entity.Department;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.generated.*;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class EmployeeMapper {

    public abstract LightUserVTO toLightUserVTO(User user);

    public abstract LookupVTO toLookupVTO(Department department);

    public abstract List<LookupVTO> toLookupVTO(List<Department> department);

    public abstract LookupVTO toLookupVTO(Employee employee);

    public abstract EmployeeContact toEmployeeContact(EmployeeContactDTO employeeContactDTO);

    public abstract List<EmployeeContact> toEmployeeContacts(List<EmployeeContactDTO> employeeContactDTOs);

    public abstract Employee toEmployee(EmployeeDTO employeeDTO);

    public abstract EmployeeVTO toEmployeeVTO(Employee employee);

    public abstract EmployeeContactVTO toEmployeeContactVTO(EmployeeContact employeeContact);

    public abstract List<EmployeeContactVTO> toEmployeeContactVTOs(List<EmployeeContact> employeeContacts);

    public abstract EmployeeListItem toEmployeeListItem(Employee employee);

    public abstract List<EmployeeListItem> toEmployeeListItems(List<Employee> employees);

    public abstract ContactTypes toContactType(String contactType);
}