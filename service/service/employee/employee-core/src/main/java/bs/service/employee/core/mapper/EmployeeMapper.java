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

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class EmployeeMapper {

    // ==================== Date/Time Conversion Helpers ====================

    // Convert String to LocalTime (for query parameters)
    protected LocalTime toLocalTime(String timeString) {
        if (timeString == null || timeString.trim().isEmpty()) {
            return null;
        }
        try {
            return LocalTime.parse(timeString);
        } catch (Exception e) {
            return null;
        }
    }

    // Convert LocalTime to String (for DTOs if needed)
    protected String toString(LocalTime localTime) {
        if (localTime == null) {
            return null;
        }
        return localTime.toString();
    }

    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(Department department);
    public abstract List<LookupVTO> toLookupVTO(List<Department> departments);

    public abstract LookupVTO toLookupVTO(Employee employee);

    // ==================== Contact Mappings ====================

    public abstract EmployeeContact toEmployeeContact(EmployeeContactDTO employeeContactDTO);

    public abstract List<EmployeeContact> toEmployeeContacts(List<EmployeeContactDTO> employeeContactDTOs);

    // ==================== Attendance Mappings ====================

    // DTO to Entity (for create/update)
    @Mapping(target = "checkInTime", expression ="(java(toLocalTime(employeeAttendanceDTO.getCheckInTime())))")
    @Mapping(target = "checkOutTime", expression ="(java(toLocalTime(employeeAttendanceDTO.getCheckOutTime())))")
    public abstract EmployeeAttendance toEmployeeAttendance(EmployeeAttendanceDTO employeeAttendanceDTO);

    // Entity to VTO (for response)
    public abstract EmployeeAttendanceVTO toEmployeeAttendanceVTO(EmployeeAttendance employeeAttendance);

    // Entity to List Item
    public abstract EmployeeAttendanceListItem toEmployeeAttendanceListItem(EmployeeAttendance employeeAttendance);

    public abstract List<EmployeeAttendanceListItem> toEmployeeAttendanceListItems(List<EmployeeAttendance> employeeAttendances);

    // ==================== Employee Mappings ====================

    // DTO to Entity (for create/update)
    public abstract Employee toEmployee(EmployeeDTO employeeDTO);

    // Entity to VTO (for response)
    public abstract EmployeeVTO toEmployeeVTO(Employee employee);

    // Contact mappings
    public abstract EmployeeContactVTO toEmployeeContactVTO(EmployeeContact employeeContact);

    public abstract List<EmployeeContactVTO> toEmployeeContactVTOs(List<EmployeeContact> employeeContacts);

    // List Item mappings
    public abstract EmployeeListItem toEmployeeListItem(Employee employee);

    public abstract List<EmployeeListItem> toEmployeeListItems(List<Employee> employees);

    // Contact List Item
    @Mapping(target = "employeeId", source = "employee.id")
    public abstract EmployeeContactListItem toEmployeeContactListItem(EmployeeContact employeeContact);

    public abstract List<EmployeeContactListItem> toEmployeeContactListItems(List<EmployeeContact> employeeContacts);

    // ==================== Enum Mappings ====================

    public abstract ContactTypes toContactType(String contactType);

    public abstract String fromContactType(ContactTypes contactType);

    // Lookup list mappings
    public abstract List<LookupVTO> toLookupVTOs(List<Employee> employees);

    public abstract List<LookupVTO> toLookupEmployeeTypesVTOs(List<EmployeeTypes> employeeTypes);

    public abstract List<LookupVTO> toLookupEmployeeAttendanceStatusVTOs(List<EmployeeAttendanceStatus> employeeAttendanceStatuses);

    public abstract LookupVTO toLookupVTO(EmployeeTypes employeeTypes);

    public abstract LookupVTO toLookupVTO(EmployeeAttendanceStatus employeeAttendanceStatus);
}