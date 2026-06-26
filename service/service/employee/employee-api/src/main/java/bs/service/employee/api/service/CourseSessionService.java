package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.generated.CourseSessionDTO;
import bs.service.employee.model.generated.CourseSessionResultSet;
import bs.service.employee.model.generated.CourseSessionVTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CourseSessionService {

    List<NewRecordVTO> createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO);

    List<NewRecordVTO> updateCourseSession(Integer courseSessionId, CourseSessionDTO courseSessionDTO);

    void deleteCourseSession(Integer courseSessionId);

    CourseSessionVTO getCourseSessionById(Integer courseSessionId);

    CourseSessionResultSet getAllCourseSessionsByFilter(Integer courseId,String sessionDay, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
    CourseSessionResultSet getAllSessionsByFilter(Integer courseId,String sessionDay, Integer trainerId, Integer placeId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
}