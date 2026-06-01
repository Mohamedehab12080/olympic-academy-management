package bs.service.trainee.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
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
}