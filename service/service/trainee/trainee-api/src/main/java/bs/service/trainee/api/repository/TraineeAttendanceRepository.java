package bs.service.trainee.api.repository;

import bs.service.trainee.model.entity.TraineeAttendance;
import bs.service.trainee.model.filter.TraineeAttendanceSearchFilter;

import java.util.List;
import java.util.Optional;

public interface TraineeAttendanceRepository {

    /**
     * Insert a new trainee attendance record
     *
     * @param traineeAttendance the attendance record to insert
     * @return the inserted attendance record with generated ID
     */
    TraineeAttendance insert(TraineeAttendance traineeAttendance);

    /**
     * Update an existing trainee attendance record
     *
     * @param traineeAttendance the attendance record to update
     * @return the updated attendance record
     */
    TraineeAttendance update(TraineeAttendance traineeAttendance);

    /**
     * Find trainee attendance by ID
     *
     * @param id the attendance record ID
     * @return Optional containing the attendance record if found
     */
    Optional<TraineeAttendance> selectById(Integer id);

    /**
     * Get all trainee attendances matching the given filters
     *
     * @param filters the search filters (traineeId, courseId, sessionId, status, dates, etc.)
     * @return list of attendance records matching the filters
     */
    List<TraineeAttendance> selectAllByFilters(TraineeAttendanceSearchFilter filters);

    /**
     * Count all trainee attendances matching the given filters
     *
     * @param filters the search filters
     * @return total count of matching attendance records
     */
    Integer countAllByFilters(TraineeAttendanceSearchFilter filters);

    /**
     * Check if a trainee is enrolled in a course (by session)
     *
     * @param traineeId the ID of the trainee
     * @param sessionId the ID of the course session
     * @return true if trainee is enrolled, false otherwise
     */
    boolean isTraineeEnrolledInCourse(Integer traineeId, Integer sessionId);

    /**
     * Soft delete attendance by ID
     *
     * @param id the attendance record ID
     */
    void softDeleteById(Integer id);

    void deleteById(Integer id);
}