package bs.service.trainee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.trainee.model.entity.TraineeAttendance;
import bs.service.trainee.model.filter.TraineeAttendanceSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TraineeAttendanceQueryBuilder extends AbstractQueryBuilderV2<TraineeAttendance, TraineeAttendanceSearchFilter> {

    public TraineeAttendanceQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(TraineeAttendanceSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters == null) {
            return qbConditions;
        }

        // شرط الحذف (isDeleted = false)
        qbConditions.add(QBCondition.builder()
                .placeHolder("isDeleted")
                .value(false)
                .condition("item.isDeleted = :PH")
                .build());

        // فلترة حسب traineeId
        if (filters.getTraineeId() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("traineeId")
                    .value(filters.getTraineeId())
                    .condition("item.trainee.id = :PH")
                    .build());
        }

        // فلترة حسب courseId
        if (filters.getCourseId() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("courseId")
                    .value(filters.getCourseId())
                    .condition("item.courseSession.course.id = :PH")
                    .build());
        }

        // فلترة حسب courseSessionId
        if (filters.getCourseSessionId() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("courseSessionId")
                    .value(filters.getCourseSessionId())
                    .condition("item.courseSession.id = :PH")
                    .build());
        }

        // فلترة حسب status
        if (filters.getStatus() != null && !filters.getStatus().trim().isEmpty()) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("status")
                    .value(filters.getStatus())
                    .condition("item.status = :PH")
                    .build());
        }

        // فلترة حسب attendanceDateFrom (باستخدام attendanceDate)
        if (filters.getAttendanceDateFrom() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("attendanceDateFrom")
                    .value(filters.getAttendanceDateFrom())
                    .condition("item.attendanceDate >= :PH")
                    .build());
        }

        // فلترة حسب attendanceDateTo (باستخدام attendanceDate)
        if (filters.getAttendanceDateTo() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("attendanceDateTo")
                    .value(filters.getAttendanceDateTo())
                    .condition("item.attendanceDate <= :PH")
                    .build());
        }

        // فلترة حسب checkInFrom
        if (filters.getCheckInFrom() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("checkInFrom")
                    .value(filters.getCheckInFrom())
                    .condition("item.checkInTime >= :PH")
                    .build());
        }

        // فلترة حسب checkInTo
        if (filters.getCheckInTo() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("checkInTo")
                    .value(filters.getCheckInTo())
                    .condition("item.checkInTime <= :PH")
                    .build());
        }

        // فلترة حسب checkOutFrom
        if (filters.getCheckOutFrom() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("checkOutFrom")
                    .value(filters.getCheckOutFrom())
                    .condition("item.checkOutTime >= :PH")
                    .build());
        }

        // فلترة حسب checkOutTo
        if (filters.getCheckOutTo() != null) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("checkOutTo")
                    .value(filters.getCheckOutTo())
                    .condition("item.checkOutTime <= :PH")
                    .build());
        }

        return qbConditions;
    }
}