package bs.service.course.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.model.enums.CourseTypes;
import bs.service.course.model.generated.CourseDTO;
import bs.service.course.model.generated.CourseResultSet;
import bs.service.course.model.generated.CourseVTO;

import java.time.LocalDate;

public interface CourseService {
    NewRecordVTO createCourse(CourseDTO courseDTO);
    NewRecordVTO updateCourse(Integer courseId,CourseDTO courseDTO);
    void deleteCourseById(Integer courseId);
    CourseVTO getCourseById(Integer courseId);
    CourseResultSet getAllCourses(String quickSearch, Boolean isActive, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy, CourseTypes courseType, LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo);
}
