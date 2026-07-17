package bs.service.trainee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.trainee.api.repository.TraineeAttendanceRepository;
import bs.service.trainee.model.entity.TraineeAttendance;
import bs.service.trainee.model.filter.TraineeAttendanceSearchFilter;
import bs.service.trainee.repository.jpa.TraineeAttendanceJPARepository;
import bs.service.trainee.repository.query.TraineeAttendanceQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Repository
@AllArgsConstructor
public class TraineeAttendanceRepositoryImpl implements TraineeAttendanceRepository {

    private final TraineeAttendanceJPARepository traineeAttendanceJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final TraineeAttendanceQueryBuilder queryBuilder;

    @Override
    public TraineeAttendance insert(TraineeAttendance traineeAttendance) {
        log.debug("Inserting new trainee attendance record");

        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        traineeAttendance.setCreatedBy(currentUser);
        traineeAttendance.setCreatedOn(LocalDateTime.now());
        traineeAttendance.setIsDeleted(false);

        return traineeAttendanceJPARepository.save(traineeAttendance);
    }

    @Override
    public TraineeAttendance update(TraineeAttendance traineeAttendance) {
        log.debug("Updating trainee attendance record with id: {}", traineeAttendance.getId());

        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        traineeAttendance.setLastModifiedBy(currentUser);
        traineeAttendance.setLastModifiedOn(LocalDateTime.now());

        return traineeAttendanceJPARepository.save(traineeAttendance);
    }

    @Override
    public Optional<TraineeAttendance> selectById(Integer id) {
        log.debug("Selecting trainee attendance by id: {}", id);
        return traineeAttendanceJPARepository.findById(id);
    }

    @Override
    public List<TraineeAttendance> selectAllByFilters(TraineeAttendanceSearchFilter filters) {
        log.debug("Selecting all trainee attendances by filters");
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(TraineeAttendanceSearchFilter filters) {
        log.debug("Counting all trainee attendances by filters");
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public boolean isTraineeEnrolledInCourse(Integer traineeId, Integer sessionId) {
        log.debug("Checking if trainee {} is enrolled in course for session {}", traineeId, sessionId);
        return traineeAttendanceJPARepository.isTraineeEnrolledInCourse(traineeId, sessionId);
    }

    @Override
    public void softDeleteById(Integer id) {
        log.debug("Soft deleting trainee attendance with id: {}", id);

        traineeAttendanceJPARepository.findById(id).ifPresent(attendance -> {
            attendance.setIsDeleted(true);
            attendance.setLastModifiedOn(LocalDateTime.now());
            attendance.setLastModifiedBy(User.builder().id(securityUtilsService.getCurrentUserId()).build());
            traineeAttendanceJPARepository.save(attendance);
        });
    }

    @Override
    public void deleteById(Integer id) {
        traineeAttendanceJPARepository.deleteById(id);
    }
}