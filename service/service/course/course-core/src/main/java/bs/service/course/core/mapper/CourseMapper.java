package bs.service.course.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.course.model.generated.*;
import bs.service.department.model.entity.Department;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.LocalTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class CourseMapper {

    // Convert String to LocalTime (for time fields from DTO)
    protected LocalTime toLocalTime(String timeString) {
        if (timeString == null || timeString.trim().isEmpty()) {
            return null;
        }
        return LocalTime.parse(timeString);
    }

    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(Department department);
    public abstract LookupVTO toLookupVTO(Course course);

    // ==================== Course Mappings ====================

    @Mapping(target = "department.id", source = "departmentId")
    public abstract Course toCourse(CourseDTO courseDTO);

    public abstract CourseVTO toCourseVTO(Course course);

    public abstract List<CourseVTO> toCourseVTOs(List<Course> courses);

}