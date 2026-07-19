package bs.service.course.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.service.CourseService;
import bs.service.course.controller.generated.CourseController;
import bs.service.course.model.enums.CourseTypes;
import bs.service.course.model.generated.CourseDTO;
import bs.service.course.model.generated.CoursePatchDTO;
import bs.service.course.model.generated.CourseResultSet;
import bs.service.course.model.generated.CourseVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@AllArgsConstructor
public class CourseControllerImpl implements CourseController {

    private final CourseService courseService;

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createCourse(CourseDTO courseDTO) {
        return ResponseEntity.ok(courseService.createCourse(courseDTO));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<CourseResultSet> _getAllCourses(String quickSearch, Boolean isActive,Boolean isPublic ,Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy, CourseTypes courseType, LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo) {
        return ResponseEntity.ok(courseService.getAllCourses(quickSearch, isActive,isPublic, pageNum, pageSize, orderDir, orderBy, courseType, startDateFrom, startDateTo, endDateFrom, endDateTo));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<CourseVTO> _getCourse(Integer courseId) {
        return ResponseEntity.ok(courseService.getCourseById(courseId));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateCourseById(Integer courseId, CourseDTO courseDTO) {
        return ResponseEntity.ok(courseService.updateCourse(courseId, courseDTO));
    }

    @Override
    @Secured(value ={"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _updatePatchOfCourses(CoursePatchDTO coursePatchDTO) {
        courseService.patchUpdateCourse(coursePatchDTO);
        return ResponseEntity.noContent().build();
    }
}
