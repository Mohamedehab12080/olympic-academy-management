package bs.service.trainee.core.mapper;

import bs.lib.common.model.Utils.EnumMapperUtils;
import bs.lib.common.model.enums.ContactTypes;
import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.CommonEnrollmentVTO;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.CourseSession;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.generated.CourseSessionVTO;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.service.trainee.model.entity.*;
import bs.service.trainee.model.enums.AcademicYear;
import bs.service.trainee.model.enums.TraineeAttendanceStatus;
import bs.service.trainee.model.generated.*;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        uses = {EnumMapperUtils.class},  // Add this to make EnumMapperUtils available
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class TraineeMapper {

    // ==================== Named Qualifiers for Enum to LookupVTO Conversion ====================

    @Named("genderToLookup")
    public LookupVTO genderToLookup(Integer genderId) {
        return EnumMapperUtils.toLookupVTO(genderId, Gender.class);
    }

    @Named("contactTypeToLookup")
    public LookupVTO contactTypeToLookup(Integer contactTypeId) {
        return EnumMapperUtils.toLookupVTO(contactTypeId, ContactTypes.class);
    }

    @Named("attendanceStatusToLookup")
    public LookupVTO attendanceStatusToLookup(Integer statusId) {
        return EnumMapperUtils.toLookupVTO(statusId, TraineeAttendanceStatus.class);
    }

    protected EnrollmentStatus toEnrollmentStatus(Integer statusId) {
        return EnumMapperUtils.toEnum(statusId, EnrollmentStatus.class);
    }

    // Convert database Integer ID to your custom PaymentStatus enum
    protected PaymentStatus toPaymentStatus(Integer statusId) {
        return EnumMapperUtils.toEnum(statusId, PaymentStatus.class);
    }

    protected LookupVTO toLookupVTO(AcademicYear academicYear) {
        return EnumMapperUtils.toLookupVTO(academicYear);
    }

    protected LookupVTO toLookupVTO(EnrollmentStatus status) {
        return EnumMapperUtils.toLookupVTO(status);
    }

    protected LookupVTO toLookupVTO(PaymentStatus status) {
        return EnumMapperUtils.toLookupVTO(status);
    }

    @Mapping(target = "enrollmentStatus", expression = "java(toLookupVTO(toEnrollmentStatus(enrollment.getEnrollmentStatus())))")
    @Mapping(target = "paymentStatus", expression = "java(toLookupVTO(toPaymentStatus(enrollment.getPaymentStatus())))")
    public abstract CommonEnrollmentVTO toCommonEnrollmentVTO(Enrollment enrollment);

    public abstract List<CommonEnrollmentVTO> toCommonEnrollmentVTOs(List<Enrollment> enrollments);

    // ==================== User Mapping ====================

    @Mapping(target = "title", source ="fullName")
    public abstract LookupVTO toLookupVTO(Employee employee);

    public abstract LightUserVTO toLightUserVTO(Trainee trainee);

    public abstract LightUserVTO toLightUserVTO(Employee employee);

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(Course course);
    public abstract LookupVTO toLookupVTOFromCourseSession(CourseSession courseSession);
    @Mapping(target = "title", source = "fullName")
    public abstract LookupVTO toLookupVTOFromTrainee(Trainee trainee);
    public abstract List<LookupVTO> toLookupVTOsFromTrainees(List<Trainee> trainees);

    @Mapping(target = "title", source = "fullName")
    public abstract TraineeLookupVTO toTraineeLookupVTOFromTrainee(Trainee trainee);
    public abstract List<TraineeLookupVTO> toTraineeLookupVTOsFromTrainees(List<Trainee> trainees);


    @Mapping(target = "title", source = "title")
    public abstract LookupVTO toLookupVTOSession(CourseSession courseSession);

    // ==================== Contact Mappings ====================

    // DTO to Entity - extract ID from ContactTypes object
    @Mapping(target = "contactType", source = "contactType.id")
    public abstract TraineeContact toTraineeContact(TraineeContactDTO traineeContactDTO);

    public abstract List<TraineeContact> toTraineeContacts(List<TraineeContactDTO> traineeContactDTOs);

    // Map TraineeContact entity to TraineeContactVTO (for VTO)
    @Mapping(target = "contactType", qualifiedByName = "contactTypeToLookup")
    public abstract TraineeContactVTO toTraineeContactVTO(TraineeContact traineeContact);

    public abstract List<TraineeContactVTO> toTraineeContactVTOs(List<TraineeContact> traineeContacts);

    // Map TraineeContact entity to TraineeContactListItem (for ListItem)
    @Mapping(target = "contactType", qualifiedByName = "contactTypeToLookup")
    public abstract TraineeContactListItem toTraineeContactListItem(TraineeContact traineeContact);

    public abstract List<TraineeContactListItem> toTraineeContactListItems(List<TraineeContact> traineeContacts);

    // ==================== Certificate Mappings ====================

    @Mapping(target = "course.id", source = "courseId")
    public abstract TraineeCertificate toTraineeCertificate(TraineeCertificateDTO traineeCertificateDTO);

    public abstract TraineeCertificateVTO toTraineeCertificateVTO(TraineeCertificate traineeCertificate);
    public abstract List<TraineeCertificateVTO> toTraineeCertificateVTOs(List<TraineeCertificate> traineeCertificates);

    // ==================== Health Condition Mappings ====================

    public abstract HealthCondition toHealthCondition(HealthConditionDTO healthConditionDTO);
    public abstract HealthConditionVTO toHealthConditionVTO(HealthCondition healthCondition);
    public abstract List<HealthConditionVTO> toHealthConditionVTOs(List<HealthCondition> healthConditions);

    // ==================== Trainee Mappings ====================

    // DTO to Entity - convert LookupVTO to ID
    @Mapping(target = "gender", source = "gender.id")
    public abstract Trainee toTrainee(TraineeDTO traineeDTO);

    // Entity to VTO - use qualifiedByName to specify which converter to use
    @Mapping(target = "gender", qualifiedByName = "genderToLookup")
    @Mapping(target = "contacts", source = "contacts")
    public abstract TraineeVTO toTraineeVTO(Trainee trainee);

    // List Item mapping - use qualifiedByName
    @Mapping(target = "gender", qualifiedByName = "genderToLookup")
    @Mapping(target = "imageUrl", source = "imageUrl")
    public abstract TraineeListItem toTraineeListItem(Trainee trainee);

    public abstract List<TraineeListItem> toTraineeListItems(List<Trainee> trainees);

    // ==================== Trainee Attendance Mappings ====================

    /**
     * Convert TraineeAttendanceDTO to TraineeAttendance entity
     */
    @Mapping(target = "isDeleted", constant = "false")
    @Mapping(target = "courseSession.id", source = "courseSessionId")
    @Mapping(target = "trainee.id", source = "traineeId")
    public abstract TraineeAttendance toTraineeAttendance(TraineeAttendanceDTO dto);

    LookupVTO toLookupVTOFromSessionStatus(Integer sessionStatusId) {
        return EnumMapperUtils.toLookupVTO(sessionStatusId, SessionStatus.class);
    }

    @Mapping(target = "status", expression = "java(toLookupVTOFromSessionStatus(courseSession.getStatus()))")
    public abstract CourseSessionVTO toCourseSessionVTO(CourseSession courseSession);
    public abstract List<CourseSessionVTO> toCourseSessionVTOs(List<CourseSession> courseSessions);

    /**
     * Convert TraineeAttendance entity to TraineeAttendanceVTO
     *
     * Important: The source property 'status' from entity is Integer,
     * target property 'status' is LookupVTO
     */
    @Mapping(target = "trainee", expression = "java(toLookupVTOFromTrainee(entity.getTrainee()))")
    @Mapping(target = "session", source = "courseSession")
    @Mapping(target = "course", source = "courseSession.course")
    @Mapping(target = "status", qualifiedByName = "attendanceStatusToLookup")
    public abstract TraineeAttendanceVTO toTraineeAttendanceVTO(TraineeAttendance entity);

    /**
     * Convert TraineeAttendance entity to TraineeAttendanceListItem
     */

    @Mapping(target = "trainee", source = "entity.trainee")
    @Mapping(target = "sessionTitle", source = "courseSession.title")
    @Mapping(target = "sessionDay", source = "courseSession.sessionDay")
    @Mapping(target = "courseTitle", source = "courseSession.course.title")
    @Mapping(target = "sessionDate", source = "courseSession.sessionDate")
    @Mapping(target = "status", qualifiedByName = "attendanceStatusToLookup")
    public abstract TraineeAttendanceListItem toTraineeAttendanceListItem(TraineeAttendance entity);

    /**
     * Convert list of TraineeAttendance entities to list of TraineeAttendanceListItem
     */
    public abstract List<TraineeAttendanceListItem> toTraineeAttendanceListItems(List<TraineeAttendance> entities);

    /**
     * Convert list of TraineeAttendance entities to list of TraineeAttendanceVTO
     */
    public abstract List<TraineeAttendanceVTO> toTraineeAttendanceVTOs(List<TraineeAttendance> entities);

}