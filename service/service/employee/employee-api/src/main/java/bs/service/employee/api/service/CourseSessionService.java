// CourseSessionService.java - Updated with day-specific DTO

package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.generated.CourseSessionDTO;
import bs.service.employee.model.generated.CourseSessionDayDTO;
import bs.service.employee.model.generated.CourseSessionResultSet;
import bs.service.employee.model.generated.CourseSessionVTO;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface CourseSessionService {

    // ============================================================
    // EXISTING METHODS (keep as is)
    // ============================================================

    List<NewRecordVTO> createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO);

    List<NewRecordVTO> updateCourseSession(CourseSessionDTO courseSessionDTO);

    void deleteCourseSession(Integer courseSessionId);

    CourseSessionVTO getCourseSessionById(Integer courseSessionId);

    CourseSessionResultSet getAllCourseSessionsByFilter(
            Integer courseId,
            List<Integer> trainerIds,
            String sessionDay,
            SessionStatus status,
            LocalDate sessionDateFrom,
            LocalDate sessionDateTo,
            String startTimeFrom,
            String startTimeTo,
            String endTimeFrom,
            String endTimeTo,
            Integer pageNum,
            Integer pageSize,
            OrderDirections orderDir,
            String orderBy);

    CourseSessionResultSet getAllSessionsByFilter(
            String quickSearch,
            Integer courseId,
            List<Integer> trainerIds,
            String sessionDay,
            Integer trainerId,
            Integer placeId,
            SessionStatus status,
            LocalDate sessionDateFrom,
            LocalDate sessionDateTo,
            String startTimeFrom,
            String startTimeTo,
            String endTimeFrom,
            String endTimeTo,
            Integer pageNum,
            Integer pageSize,
            OrderDirections orderDir,
            String orderBy);

    // ============================================================
    // NEW DAY-SPECIFIC METHODS (using CourseSessionDayDTO)
    // ============================================================

    /**
     * UPDATE: Update sessions for a specific day and course
     * Uses CourseSessionDayDTO with sessionDay (singular)
     */
    List<NewRecordVTO> updateSessionsByDayAndCourse(CourseSessionDayDTO courseSessionDayDTO);

    /**
     * UPDATE: Update sessions for a specific day and trainers
     * Uses CourseSessionDayDTO with sessionDay (singular)
     */
    List<NewRecordVTO> updateSessionsByDayAndTrainer(CourseSessionDayDTO courseSessionDayDTO);

    /**
     * DELETE: Delete all sessions for a specific day and course
     */
    void deleteSessionsByDayAndCourse(Integer courseId, String day);

    /**
     * DELETE: Delete sessions for specific day, course, and trainers
     */
    void deleteSessionsByDayCourseAndTrainers(Integer courseId, String day, List<Integer> trainerIds);

    /**
     * DELETE: Delete sessions for specific trainer(s) on a specific day
     */
    void deleteSessionsByDayAndTrainer(Integer courseId, String day, List<Integer> trainerIds);

    /**
     * DELETE: Delete all sessions for a specific day (all trainers)
     */
    void deleteSessionsByDay(Integer courseId, String day);

    /**
     * DELETE: Delete a specific session by its ID
     */
    void deleteSpecificSession(Integer sessionId);
}