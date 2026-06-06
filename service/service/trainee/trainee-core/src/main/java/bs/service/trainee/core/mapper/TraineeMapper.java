package bs.service.trainee.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.CourseSession;
import bs.service.trainee.model.entity.*;
import bs.service.trainee.model.generated.*;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class TraineeMapper {

    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(Course course);
    public abstract LookupVTO toLookupVTOFromCourseSession(CourseSession courseSession) ;
    public abstract LookupVTO toLookupVTOFromTrainee(Trainee trainee) ;
    public abstract LookupVTO toLookupVTOSession(CourseSession courseSession);

    // ==================== Contact Mappings ====================

    public abstract TraineeContact toTraineeContact(TraineeContactDTO traineeContactDTO);

    public abstract List<TraineeContact> toTraineeContacts(List<TraineeContactDTO> traineeContactDTOs);

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

    public abstract Trainee toTrainee(TraineeDTO traineeDTO);

    public abstract TraineeVTO toTraineeVTO(Trainee trainee);

    public abstract TraineeContactListItem toTraineeContactListItem(TraineeContact traineeContact);

    public abstract List<TraineeContactListItem> toTraineeContactListItems(List<TraineeContact> traineeContacts);

    public abstract TraineeListItem toTraineeListItem(Trainee trainee);

    public abstract List<TraineeListItem> toTraineeListItems(List<Trainee> trainees);

    // ==================== Trainee Attendance Mappings ====================

    /**
     * Convert TraineeAttendanceDTO to TraineeAttendance entity
     */
    @Mapping(target = "isDeleted", constant = "false")
    public abstract TraineeAttendance toTraineeAttendance(TraineeAttendanceDTO dto);

    /**
     * Convert TraineeAttendance entity to TraineeAttendanceVTO
     */
    @Mapping(target = "trainee", expression = "java(toLookupVTOFromTrainee(entity.getTrainee()))")
    @Mapping(target = "session", expression = "java(toLookupVTOSession(entity.getCourseSession()))")
    public abstract TraineeAttendanceVTO toTraineeAttendanceVTO(TraineeAttendance entity);

    /**
     * Convert TraineeAttendance entity to TraineeAttendanceListItem
     */
    @Mapping(target = "traineeName", source = "trainee.fullName")
    @Mapping(target = "sessionTitle", source = "courseSession.title")
    @Mapping(target = "courseTitle", source = "courseSession.course.title")
    @Mapping(target = "sessionDate", source = "courseSession.sessionDate")
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