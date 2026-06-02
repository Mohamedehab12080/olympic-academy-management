package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.generated.TrainerCourseAssignmentResultSet;
import bs.service.employee.model.generated.TrainerCourseResultSet;

public interface TrainerCourseService {

    /**
     * Assign a course to a trainer
     * @param trainerId The employee ID (must be a trainer)
     * @param courseId The course ID to assign
     * @return NewRecordVTO with the assignment ID
     */
    NewRecordVTO assignCourseToTrainer(Integer trainerId, Integer courseId);

    /**
     * Unassign a course from a trainer
     * @param trainerId The employee ID
     * @param courseId The course ID to unassign
     */
    void unassignCourseFromTrainer(Integer trainerId, Integer courseId);

    /**
     * Get all courses assigned to a specific trainer
     * @param trainerId The employee ID
     * @param pageNum Page number
     * @param pageSize Page size
     * @param orderDir Order direction
     * @param orderBy Order by attribute
     * @return TrainerCourseResultSet containing list of courses
     */
    TrainerCourseResultSet getTrainerCoursesByFilter(Integer trainerId, Integer pageNum, Integer pageSize,
                                             OrderDirections orderDir, String orderBy);

    /**
     * Get all trainer-course assignments with optional filters
     * @param trainerId Optional trainer ID filter
     * @param courseId Optional course ID filter
     * @param pageNum Page number
     * @param pageSize Page size
     * @param orderDir Order direction
     * @param orderBy Order by attribute
     * @return TrainerCourseAssignmentResultSet containing all assignments
     */
    TrainerCourseAssignmentResultSet getAllTrainerCourseAssignmentsByFilter(Integer trainerId, Integer courseId,
                                                                    Integer pageNum, Integer pageSize,
                                                                    OrderDirections orderDir, String orderBy);
}