package bs.service.employee.core.mapper;

import bs.lib.common.model.enums.ContactTypes;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.department.model.entity.Department;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.EmployeeAttendance;
import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.generated.*;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class EmployeeMapper {

    // User mapping
    public abstract LightUserVTO toLightUserVTO(User user);

    // Lookup mappings
    public abstract LookupVTO toLookupVTO(Department department);
    public abstract List<LookupVTO> toLookupVTO(List<Department> departments);

    public abstract LookupVTO toLookupVTO(Employee employee);

    // Contact mappings
    public abstract EmployeeContact toEmployeeContact(EmployeeContactDTO employeeContactDTO);

    public abstract List<EmployeeContact> toEmployeeContacts(List<EmployeeContactDTO> employeeContactDTOs);

    // Attendance mappings
    public abstract EmployeeAttendance toEmployeeAttendance(EmployeeAttendanceDTO employeeAttendanceDTO);

    public abstract EmployeeAttendanceVTO toEmployeeAttendanceVTO(EmployeeAttendance employeeAttendance);

    public abstract EmployeeAttendanceListItem toEmployeeAttendanceListItem(EmployeeAttendance employeeAttendance);

    public abstract List<EmployeeAttendanceListItem> toEmployeeAttendanceListItems(List<EmployeeAttendance> employeeAttendances);

    // Employee mappings
    public abstract Employee toEmployee(EmployeeDTO employeeDTO);

    public abstract EmployeeVTO toEmployeeVTO(Employee employee);

    public abstract EmployeeContactVTO toEmployeeContactVTO(EmployeeContact employeeContact);

    public abstract List<EmployeeContactVTO> toEmployeeContactVTOs(List<EmployeeContact> employeeContacts);

    public abstract EmployeeListItem toEmployeeListItem(Employee employee);

    public abstract List<EmployeeListItem> toEmployeeListItems(List<Employee> employees);

    public abstract EmployeeContactListItem toEmployeeContactListItem(EmployeeContact employeeContact);

    public abstract List<EmployeeContactListItem> toEmployeeContactListItems(List<EmployeeContact> employeeContacts);

    public abstract ContactTypes toContactType(String contactType);

    public abstract List<LookupVTO> toLookupVTOs(List<Employee> employees);

    public abstract List<LookupVTO> toLookupEmployeeTypesVTOs(List<EmployeeTypes> employeeTypes) ;

    public abstract List<LookupVTO> toLookupEmployeeAttendanceStatusVTOs(List<EmployeeAttendanceStatus> employeeAttendanceStatuses) ;


}