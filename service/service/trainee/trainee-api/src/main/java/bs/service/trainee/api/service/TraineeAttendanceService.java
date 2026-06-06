package bs.service.trainee.api.service;

import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.model.enums.TraineeAttendanceStatus;
import bs.service.trainee.model.generated.*;

import java.time.LocalDate;
import java.util.List;

/**
 * Service interface for managing trainee attendance
 */
public interface TraineeAttendanceService {

    // ==================== Basic CRUD Operations ====================

    /**
     * Create a new trainee attendance record
     *
     * @param traineeAttendanceDTO the attendance data
     * @return NewRecordVTO containing the created record ID
     */
    NewRecordVTO createTraineeAttendance(TraineeAttendanceDTO traineeAttendanceDTO);

    /**
     * Update an existing trainee attendance record
     *
     * @param attendanceId the ID of the attendance record
     * @param traineeAttendanceDTO the updated attendance data
     * @return NewRecordVTO containing the updated record ID
     */
    NewRecordVTO updateTraineeAttendance(Integer attendanceId, TraineeAttendanceDTO traineeAttendanceDTO);

    /**
     * Soft delete a trainee attendance record
     *
     * @param attendanceId the ID of the attendance record to delete
     */
    void deleteTraineeAttendanceById(Integer attendanceId);

    /**
     * Get a trainee attendance record by ID
     *
     * @param attendanceId the ID of the attendance record
     * @return TraineeAttendanceVTO containing the attendance details
     */
    TraineeAttendanceVTO getTraineeAttendanceById(Integer attendanceId);


    // ==================== Query Operations ====================

    /**
     * Get all trainee attendances with filters
     *
     * @param traineeId filter by trainee ID (optional)
     * @param courseId filter by course ID (optional)
     * @param courseSessionId filter by course session ID (optional)
     * @param status filter by attendance status (optional)
     * @param fromDate filter by attendance date from (optional)
     * @param toDate filter by attendance date to (optional)
     * @param pageNum page number for pagination
     * @param pageSize page size for pagination
     * @param orderDir sort direction (ASC/DESC)
     * @param orderBy sort field name
     * @return TraineeAttendanceResultSet containing paginated attendance records
     */
    TraineeAttendanceResultSet getAllTraineeAttendances(Integer traineeId, Integer courseId, Integer courseSessionId, TraineeAttendanceStatus status, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, LocalDate fromDate, LocalDate toDate, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);

    /**
     * Get daily attendance report for a specific date
     *
     * @param attendanceDate the date to generate report for
     * @return DailyAttendanceReport containing attendance statistics
     */
    DailyAttendanceReport getDailyAttendanceReport(LocalDate attendanceDate);

    /**
     * Get attendance report for a specific session
     *
     * @param sessionId the ID of the course session
     * @return SessionAttendanceReport containing session attendance statistics
     */
    SessionAttendanceReport getSessionAttendanceReport(Integer sessionId);


    // ==================== Batch Operations ====================

    /**
     * Batch create multiple trainee attendance records
     *
     * @param attendances list of attendance data
     * @return List of NewRecordVTO containing created record IDs
     */
    List<NewRecordVTO> batchCreateTraineeAttendances(List<TraineeAttendanceDTO> attendances);


    // ==================== Lookup Operations ====================

    /**
     * Get all trainee attendance statuses for lookup
     *
     * @return LookupResultSet containing attendance statuses
     */
    LookupResultSet getTraineeAttendanceStatusLookup();
}