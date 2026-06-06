package bs.service.trainee.repository.jpa;

import bs.service.trainee.model.entity.TraineeAttendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TraineeAttendanceJPARepository extends JpaRepository<TraineeAttendance, Integer> {

    /**
     *
     * @param traineeId
     * @param sessionId
     * @return true false otherwise
     */
    @Query("""
        SELECT COUNT(e) > 0 FROM Enrollment e 
        WHERE e.trainee.id = :traineeId 
        AND e.course.id = (SELECT cs.course.id FROM CourseSession cs WHERE cs.id = :sessionId)
        AND e.isActive = true
    """)
    boolean isTraineeEnrolledInCourse(@Param("traineeId") Integer traineeId, @Param("sessionId") Integer sessionId);
}