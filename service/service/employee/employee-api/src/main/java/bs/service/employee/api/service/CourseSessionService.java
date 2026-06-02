package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.generated.CourseSessionDTO;
import bs.service.employee.model.generated.CourseSessionResultSet;
import bs.service.employee.model.generated.CourseSessionVTO;

import java.time.LocalDate;
import java.time.LocalTime;

public interface CourseSessionService {

    NewRecordVTO createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO);

    NewRecordVTO updateCourseSession(Integer courseId, Integer sessionId, CourseSessionDTO courseSessionDTO);

    void deleteCourseSession(Integer courseId, Integer sessionId);

    CourseSessionVTO getCourseSessionById(Integer courseId, Integer sessionId);

    CourseSessionResultSet getAllCourseSessionsByFilter(Integer courseId, SessionStatus status,
                                                        LocalDate sessionDateFrom, LocalDate sessionDateTo,
                                                        LocalTime startTimeFrom, LocalTime startTimeTo,
                                                        LocalTime endTimeFrom, LocalTime endTimeTo,
                                                        Integer pageNum, Integer pageSize,
                                                        OrderDirections orderDir, String orderBy);

    CourseSessionResultSet getAllSessionsByFilter(Integer courseId, Integer employeeId, Integer placeId,
                                                  SessionStatus status, LocalDate sessionDateFrom,
                                                  LocalDate sessionDateTo, LocalTime startTimeFrom,
                                                  LocalTime startTimeTo, LocalTime endTimeFrom,
                                                  LocalTime endTimeTo, Integer pageNum, Integer pageSize,
                                                  OrderDirections orderDir, String orderBy);
}