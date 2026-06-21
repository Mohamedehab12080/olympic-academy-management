package bs.service.course.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.course.api.service.CourseService;
import bs.service.course.controller.generated.CourseLookupController;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class CourseLookupControllerImpl implements CourseLookupController {

    private final CourseService courseService;

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllCourseTypesLookup() {
        return ResponseEntity.ok(courseService.getAllCoursesTypesLookup());
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllCoursesLookup() {
        return ResponseEntity.ok(courseService.getAllCoursesLookup());
    }
}
