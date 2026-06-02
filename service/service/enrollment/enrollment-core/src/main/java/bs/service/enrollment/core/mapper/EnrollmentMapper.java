package bs.service.enrollment.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.Employee;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.generated.*;
import bs.service.trainee.model.entity.Trainee;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class EnrollmentMapper {


    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(Trainee trainee);
    public abstract LookupVTO toLookupVTO(Course course);
    public abstract LookupVTO toLookupVTO(Employee employee);
    public abstract LookupVTO toLookupVTO(EnrollmentType enrollmentType);

    // ==================== Enrollment Type Mappings ====================

    public abstract EnrollmentType toEnrollmentType(EnrollmentTypeDTO enrollmentTypeDTO);

    public abstract EnrollmentTypeVTO toEnrollmentTypeVTO(EnrollmentType enrollmentType);

    public abstract List<EnrollmentTypeVTO> toEnrollmentTypeVTOs(List<EnrollmentType> enrollmentTypes);

    // ==================== Enrollment Mappings ====================

    @Mapping(target = "trainee.id", source = "traineeId")
    @Mapping(target = "course.id", source = "courseId")
    @Mapping(target = "trainer.id", source = "trainerId")
    @Mapping(target = "enrollmentType.id", source = "enrollmentTypeId")
    public abstract Enrollment toEnrollment(EnrollmentDTO enrollmentDTO);

    public abstract EnrollmentVTO toEnrollmentVTO(Enrollment enrollment);

    public abstract EnrollmentListItem toEnrollmentListItem(Enrollment enrollment);

    public abstract List<EnrollmentListItem> toEnrollmentListItems(List<Enrollment> enrollments);
}