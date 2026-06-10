package bs.service.enrollment.proxy.internal.mapper;

import bs.lib.common.model.Utils.EnumMapperUtils;
import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.Employee;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.service.trainee.model.entity.Trainee;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class, EnumMapperUtils.class, EnrollmentStatus.class})
public abstract class EnrollmentMgtProxyMapper {


    public abstract LightUserVTO toLightUserVTO(User user);

    protected EnrollmentStatus toEnrollmentStatus(Integer statusId) {
        return EnumMapperUtils.toEnum(statusId, EnrollmentStatus.class);
    }
    protected PaymentStatus toPaymentStatus(Integer statusId) {
        return EnumMapperUtils.toEnum(statusId, PaymentStatus.class);
    }
    protected LookupVTO toLookupVTO(EnrollmentStatus status) {
        return EnumMapperUtils.toLookupVTO(status);
    }

    protected LookupVTO toLookupVTO(PaymentStatus status) {
        return EnumMapperUtils.toLookupVTO(status);
    }

    @Mapping(target = "title", source = "fullName")
    public abstract LookupVTO toLookupVTO(Trainee trainee);
    public abstract LookupVTO toLookupVTO(Course course);
    @Mapping(target = "title", source = "fullName")
    public abstract LookupVTO toLookupVTO(Employee employee);
    public abstract LookupVTO toLookupVTO(EnrollmentType enrollmentType);

    @Mapping(target = "enrollmentStatus", expression = "java(toLookupVTO(toEnrollmentStatus(enrollment.getEnrollmentStatus())))")
    @Mapping(target = "paymentStatus", expression = "java(toLookupVTO(toPaymentStatus(enrollment.getPaymentStatus())))")
    public abstract EnrollmentVTO toEnrollmentVTO(Enrollment enrollment);

    public abstract List<EnrollmentVTO> toEnrollmentVTOs(List<Enrollment> enrollments);

}
