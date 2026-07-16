package bs.service.employee.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.employee.model.generated.AssignCourseDTO;
import bs.service.employee.model.generated.TrainerCourseAssignmentResultSet;
import bs.service.employee.model.generated.TrainerCourseResultSet;

public interface TrainerCourseService {

    /**
     * Assign a course to a trainer
     * @param trainerId The employee ID (must be a trainer)
     * @param courseId The course ID to assign
     * @return NewRecordVTO with the assignment ID
     */
    NewRecordVTO assignCourseToTrainer(Integer trainerId, AssignCourseDTO assignCourseDTO);

    /**
     * Unassign a course from a trainer
     * @param trainerCourseId
     */
    void unassignCourseFromTrainer(Integer trainerCourseId);

    /**
     * Get all courses assigned to a specific trainer
     * @param trainerId The employee ID
     * @param pageNum Page number
     * @param pageSize Page size
     * @param orderDir Order direction
     * @param orderBy Order by attribute
     * @return TrainerCourseResultSet containing list of courses
     */
    TrainerCourseResultSet getTrainerCoursesByFilter(String quickSearch,Integer trainerId, Integer courseId,
                                                     Integer pageNum, Integer pageSize,
                                                     OrderDirections orderDir, String orderBy);
}