package bs.service.employee.core.mapper;

import bs.lib.common.model.Utils.EnumMapperUtils;
import bs.lib.common.model.enums.ContactTypes;
import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.department.model.entity.Department;
import bs.service.employee.model.entity.*;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.enums.SessionStatus;
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
        imports = {OffsetDateTime.class, ZoneOffset.class, EnumMapperUtils.class, ContactTypes.class})
public abstract class EmployeeMapper {

    // ==================== Date/Time Conversion Helpers ====================

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

    protected String toString(LocalTime localTime) {
        if (localTime == null) {
            return null;
        }
        return localTime.toString();
    }

    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    @Mapping(target = "title", source = "fullName")
    public abstract LookupVTO toLookupVTO(Employee employee);

    // ==================== Contact Mappings ====================

    // Convert ContactTypes enum to LookupVTO using the utility
    LookupVTO toLookupVTOFromContactType(Integer contactTypeId) {
        return EnumMapperUtils.toLookupVTO(contactTypeId, ContactTypes.class);
    }

    LookupVTO toLookupVTOFromAttendanceStatus(Integer attendanceStatusId) {
        return EnumMapperUtils.toLookupVTO(attendanceStatusId, EmployeeAttendanceStatus.class);
    }

    LookupVTO toLookupVTOFromEmployeeType(Integer employeeTypeId) {
        return EnumMapperUtils.toLookupVTO(employeeTypeId, EmployeeTypes.class);
    }

    LookupVTO toLookupVTOFromSalaryType(Integer salaryTypeId) {
        return EnumMapperUtils.toLookupVTO(salaryTypeId, SalaryTypes.class);
    }

    LookupVTO toLookupVTOFromGender(Integer genderId) {
        return EnumMapperUtils.toLookupVTO(genderId, Gender.class);
    }

    LookupVTO toLookupVTOFromSessionStatus(Integer sessionStatusId) {
        return EnumMapperUtils.toLookupVTO(sessionStatusId, SessionStatus.class);
    }

    public abstract EmployeeContact toEmployeeContact(EmployeeContactDTO employeeContactDTO);
    public abstract List<EmployeeContact> toEmployeeContacts(List<EmployeeContactDTO> employeeContactDTOs);

    // Use the utility to map contactType Integer to LookupVTO
    @Mapping(target = "contactType", expression = "java(toLookupVTOFromContactType(employeeContact.getContactType()))")
    public abstract EmployeeContactVTO toEmployeeContactVTO(EmployeeContact employeeContact);

    public abstract List<EmployeeContactVTO> toEmployeeContactVTOs(List<EmployeeContact> employeeContacts);

    // ==================== Attendance Mappings ====================

    @Mapping(target = "checkInTime", expression = "java(toLocalTime(employeeAttendanceDTO.getCheckInTime()))")
    @Mapping(target = "checkOutTime", expression = "java(toLocalTime(employeeAttendanceDTO.getCheckOutTime()))")
    public abstract EmployeeAttendance toEmployeeAttendance(EmployeeAttendanceDTO employeeAttendanceDTO);

    @Mapping(target = "status", expression = "java(toLookupVTOFromAttendanceStatus(employeeAttendance.getStatus()))")
    public abstract EmployeeAttendanceVTO toEmployeeAttendanceVTO(EmployeeAttendance employeeAttendance);

    @Mapping(target = "status", expression = "java(toLookupVTOFromAttendanceStatus(employeeAttendance.getStatus()))")
    public abstract EmployeeAttendanceListItem toEmployeeAttendanceListItem(EmployeeAttendance employeeAttendance);

    public abstract List<EmployeeAttendanceListItem> toEmployeeAttendanceListItems(List<EmployeeAttendance> employeeAttendances);

    // ==================== Employee Mappings ====================

    @Mapping(target = "employeeType", source = "employeeDTO.employeeType.id")
    @Mapping(target = "salaryType", source = "employeeDTO.salaryType.id")
    @Mapping(target = "gender", source = "employeeDTO.gender.id")
    public abstract Employee toEmployee(EmployeeDTO employeeDTO);
    @Mapping(target = "employeeType", expression= "java(toLookupVTOFromEmployeeType(employee.getEmployeeType()))")
    @Mapping(target = "salaryType", expression= "java(toLookupVTOFromSalaryType(employee.getSalaryType()))")
    @Mapping(target = "gender", expression= "java(toLookupVTOFromGender(employee.getGender()))")
    public abstract EmployeeVTO toEmployeeVTO(Employee employee);
    @Mapping(target = "employeeType", expression= "java(toLookupVTOFromEmployeeType(employee.getEmployeeType()))")
    @Mapping(target = "gender", expression= "java(toLookupVTOFromGender(employee.getGender()))")
    @Mapping(target = "imageUrl",expression="java(employee.getImageUrl())")
    @Mapping(target = "isActive",source="isActive")
    public abstract EmployeeListItem toEmployeeListItem(Employee employee);
    public abstract List<EmployeeListItem> toEmployeeListItems(List<Employee> employees);
    @Mapping(target = "contactType", expression = "java(toLookupVTOFromContactType(employeeContact.getContactType()))")
    public abstract EmployeeContactListItem toEmployeeContactListItem(EmployeeContact employeeContact);
    public abstract List<EmployeeContactListItem> toEmployeeContactListItems(List<EmployeeContact> employeeContacts);

    // ==================== Enum Mappings ====================

    public abstract ContactTypes toContactType(String contactType);
    public abstract String fromContactType(ContactTypes contactType);

    @Mapping(target = "trainer", source = "employee")
    public abstract TrainerDepartmentVTO toTrainerDepartmentVTO(EmployeeDepartment employeeDepartment);

    // Lookup list mappings
    @Mapping(target = "salaryType", expression= "java(toLookupVTOFromSalaryType(employee.getSalaryType()))")
    @Mapping(target = "employeeType", expression= "java(toLookupVTOFromEmployeeType(employee.getEmployeeType()))")
    public abstract EmployeeLookupVTO toEmployeeLookupVTO(Employee employee);
    public abstract List<EmployeeLookupVTO> toEmployeeLookupVTOs(List<Employee> employees);
    public abstract List<LookupVTO> toLookupVTOs(List<Employee> employees);
    public abstract List<LookupVTO> toLookupEmployeeTypesVTOs(List<EmployeeTypes> employeeTypes);
    public abstract List<LookupVTO> toLookupEmployeeAttendanceStatusVTOs(List<EmployeeAttendanceStatus> employeeAttendanceStatuses);
    public abstract LookupVTO toLookupVTO(EmployeeTypes employeeTypes);
    public abstract LookupVTO toLookupVTO(EmployeeAttendanceStatus employeeAttendanceStatus);
    public abstract LookupVTO toLookupVTO(Course course);
    public abstract List<LookupVTO> toLookupCourseVTOs(List<Course> course);

    // Trainer Course mappings
    public abstract TrainerCourseVTO toTrainerCourseVTO(TrainerCourse trainerCourse);
    public abstract List<TrainerCourseVTO> toTrainerCourseVTOs(List<TrainerCourse> trainerCourses);
    public abstract TrainerCourseAssignmentVTO toTrainerCourseAssignmentVTO(TrainerCourse trainerCourse);
    public abstract List<TrainerCourseAssignmentVTO> toTrainerCourseAssignmentVTOs(List<TrainerCourse> trainerCourses);

    // ==================== Course Session Mappings ====================

    public abstract LookupVTO toLookupVTO(SessionStatus sessionStatus);

    @Mapping(target = "course.id", source = "courseId")
    @Mapping(target = "trainer.id", source = "trainerId")
    @Mapping(target = "place.id", source = "placeId")
    @Mapping(target = "status", source = "status.id")
    public abstract CourseSession toCourseSession(CourseSessionDTO courseSessionDTO);

    @Mapping(target = "status", expression = "java(toLookupVTOFromSessionStatus(courseSession.getStatus()))")
    public abstract CourseSessionVTO toCourseSessionVTO(CourseSession courseSession);
    public abstract List<CourseSessionVTO> toCourseSessionVTOs(List<CourseSession> courseSessions);
    public abstract List<TrainerDepartmentVTO> toTrainerDepartmentVTOs(List<EmployeeDepartment> employeeDepartments);

    public abstract LookupVTO toEmployeeDepartmentLookupVTO(EmployeeDepartment employeeDepartment);

    public abstract List<LookupVTO> toEmployeeDepartmentLookupVTOs(List<EmployeeDepartment> employeeDepartments);


    public abstract LookupVTO toDepartmentLookupVTO(Department departments);

    public abstract List<LookupVTO> toDepartmentLookupVTOs(List<Department> departments);
}