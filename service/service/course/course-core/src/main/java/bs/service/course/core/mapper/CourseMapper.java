package bs.service.course.core.mapper;

import bs.lib.common.model.Utils.EnumMapperUtils;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.course.model.enums.CourseTypes;
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
        imports = {OffsetDateTime.class, ZoneOffset.class, EnumMapperUtils.class, CourseTypes.class})
public abstract class CourseMapper {

    // ==================== Date/Time Conversion Helpers ====================

    protected LocalTime toLocalTime(String timeString) {
        if (timeString == null || timeString.trim().isEmpty()) {
            return null;
        }
        return LocalTime.parse(timeString);
    }

    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings (Auto-detected by MapStruct) ====================

    public abstract LookupVTO toLookupVTO(Department department);
    public abstract LookupVTO toLookupVTO(Course course);

    // ==================== Enum to LookupVTO Helper Methods ====================

    /**
     * Convert Integer courseType ID to LookupVTO using CourseTypes enum
     */
    protected LookupVTO toLookupVTOFromCourseType(Integer courseTypeId) {
        return EnumMapperUtils.toLookupVTO(courseTypeId, CourseTypes.class);
    }

    // ==================== DTO to Entity Mappings (extract IDs) ====================

    @Mapping(target = "department.id", source = "departmentId")
    @Mapping(target = "courseType", source = "courseType.id")
    public abstract Course toCourse(CourseDTO courseDTO);

    // ==================== Entity to VTO Mappings (convert IDs to LookupVTO) ====================

    @Mapping(target = "courseType", expression = "java(toLookupVTOFromCourseType(course.getCourseType()))")
    public abstract CourseVTO toCourseVTO(Course course);

    public abstract List<CourseVTO> toCourseVTOs(List<Course> courses);

    // ==================== Lookup List Mappings ====================

    public abstract List<LookupVTO> toLookupCourseTypeVTOs(List<CourseTypes> courseTypes);

    public abstract List<LookupVTO> toLookupVTOs(List<Course> courses);

}