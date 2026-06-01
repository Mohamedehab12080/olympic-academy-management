package bs.service.course.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.course.model.generated.CourseDTO;
import bs.service.course.model.generated.CourseVTO;
import bs.service.department.model.entity.Department;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class CourseMapper {

    public abstract LightUserVTO toLightUserVTO(User user);

    public abstract LookupVTO toLookupVTO(Course course);

    public abstract LookupVTO toLookupVTO(Department department);

    @Mapping(target = "department.id", source = "departmentId")
    public abstract Course toCourse(CourseDTO courseDTO);

    public abstract CourseVTO toCourseVTO(Course course);

    public abstract List<CourseVTO> toCourseVTOs(List<Course> courses);
}
