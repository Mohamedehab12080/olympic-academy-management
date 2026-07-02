package bs.service.enrollment.core.mapper;

import bs.lib.common.model.Utils.EnumMapperUtils;
import bs.lib.common.model.enums.PaymentStatus;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.Employee;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.enrollment.model.generated.*;
import bs.service.trainee.model.entity.Trainee;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class, EnumMapperUtils.class})
public abstract class EnrollmentMapper {

    // ==================== Enum to Enum Helper Methods ====================

    // Convert database Integer ID to your custom EnrollmentStatus enum
    protected EnrollmentStatus toEnrollmentStatus(Integer statusId) {
        return EnumMapperUtils.toEnum(statusId, EnrollmentStatus.class);
    }

    // Convert database Integer ID to your custom PaymentStatus enum
    protected PaymentStatus toPaymentStatus(Integer statusId) {
        return EnumMapperUtils.toEnum(statusId, PaymentStatus.class);
    }

    // Convert custom enum to LookupVTO (for API responses)
    protected LookupVTO toLookupVTO(EnrollmentStatus status) {
        return EnumMapperUtils.toLookupVTO(status);
    }

    protected LookupVTO toLookupVTO(PaymentStatus status) {
        return EnumMapperUtils.toLookupVTO(status);
    }

    // ==================== User Mapping ====================
    public abstract LightUserVTO toLightUserVTO(Trainee trainee);

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================
    // MapStruct auto-detects these for entity to LookupVTO conversion

    @Mapping(target = "title", source = "fullName")
    public abstract LookupVTO toLookupVTO(Trainee trainee);
    public abstract LookupVTO toLookupVTO(Course course);
    @Mapping(target = "title", source = "fullName")
    public abstract LookupVTO toLookupVTO(Employee employee);
    public abstract LookupVTO toLookupVTO(EnrollmentType enrollmentType);

    // ==================== Enrollment Type Mappings ====================

    public abstract EnrollmentType toEnrollmentType(EnrollmentTypeDTO enrollmentTypeDTO);
    public abstract EnrollmentTypeVTO toEnrollmentTypeVTO(EnrollmentType enrollmentType);
    public abstract List<EnrollmentTypeVTO> toEnrollmentTypeVTOs(List<EnrollmentType> enrollmentTypes);

    // ==================== Enrollment Mappings ====================

    // DTO to Entity - your custom enum objects are sent from frontend
    // Extract the ID to store in database
    @Mapping(target = "trainee.id", source = "traineeId")
    @Mapping(target = "course.id", source = "courseId")
    @Mapping(target = "trainer.id", source = "trainerId")
    @Mapping(target = "enrollmentType.id", source = "enrollmentTypeId")
    @Mapping(target = "enrollmentStatus", source = "enrollmentStatus.id")
    @Mapping(target = "paymentStatus", source = "paymentStatus.id")
    public abstract Enrollment toEnrollment(EnrollmentDTO enrollmentDTO);

    // Entity to VTO - database stores Integer IDs
    // Convert to your custom enum first, then to LookupVTO
    @Mapping(target = "enrollmentStatus", expression = "java(toLookupVTO(toEnrollmentStatus(enrollment.getEnrollmentStatus())))")
    @Mapping(target = "paymentStatus", expression = "java(toLookupVTO(toPaymentStatus(enrollment.getPaymentStatus())))")
    public abstract EnrollmentVTO toEnrollmentVTO(Enrollment enrollment);

    // List Item mapping - same pattern
    @Mapping(target = "enrollmentStatus", expression = "java(toLookupVTO(toEnrollmentStatus(enrollment.getEnrollmentStatus())))")
    @Mapping(target = "paymentStatus", expression = "java(toLookupVTO(toPaymentStatus(enrollment.getPaymentStatus())))")
    public abstract EnrollmentListItem toEnrollmentListItem(Enrollment enrollment);

    public abstract List<EnrollmentListItem> toEnrollmentListItems(List<Enrollment> enrollments);

    @Mapping(target = "title", expression = "java(enrollment.getTrainee().getFullName() + \" -- \" + enrollment.getCourse().getTitle())")
    public abstract LookupVTO toEnrollmentLookupVTO(Enrollment enrollment);

    public abstract List<LookupVTO> toEnrollmentLookupVTOs(List<Enrollment> enrollments);
}