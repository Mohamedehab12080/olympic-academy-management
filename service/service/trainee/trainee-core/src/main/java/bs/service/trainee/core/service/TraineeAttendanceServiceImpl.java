package bs.service.trainee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.repository.TraineeAttendanceRepository;
import bs.service.trainee.api.service.TraineeAttendanceService;
import bs.service.trainee.core.mapper.TraineeMapper;
import bs.service.trainee.model.entity.TraineeAttendance;
import bs.service.trainee.model.enums.TraineeAttendanceStatus;
import bs.service.trainee.model.filter.TraineeAttendanceSearchFilter;
import bs.service.trainee.model.generated.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

import static bs.service.trainee.model.enums.TraineeErrors.*;

@Slf4j
@Service
@AllArgsConstructor
public class TraineeAttendanceServiceImpl implements TraineeAttendanceService {

    private final TraineeAttendanceRepository traineeAttendanceRepository;
    private final TraineeMapper traineeMapper;

    // ==================== Basic CRUD Operations ====================

    @Override
    @Transactional
    public NewRecordVTO createTraineeAttendance(TraineeAttendanceDTO traineeAttendanceDTO) {
        log.info("Creating trainee attendance for traineeId: {}, sessionId: {}",
                traineeAttendanceDTO.getTraineeId(), traineeAttendanceDTO.getCourseSessionId());

        boolean isEnrolled = traineeAttendanceRepository.isTraineeEnrolledInCourse(
                traineeAttendanceDTO.getTraineeId(), traineeAttendanceDTO.getCourseSessionId());

        if (!isEnrolled) {
            throw new BusinessException(TRAINEE_NOT_ENROLLED_IN_COURSE, traineeAttendanceDTO.getTraineeId());
        }

        TraineeAttendanceSearchFilter checkFilter = TraineeAttendanceSearchFilter.builder()
                .traineeId(traineeAttendanceDTO.getTraineeId())
                .courseSessionId(traineeAttendanceDTO.getCourseSessionId())
                .attendanceDateFrom(traineeAttendanceDTO.getAttendanceDate())
                .attendanceDateTo(traineeAttendanceDTO.getAttendanceDate())
                .pagination(PaginationInfo.noPagination())
                .build();

        List<TraineeAttendance> existing = traineeAttendanceRepository.selectAllByFilters(checkFilter);

        if (!existing.isEmpty()) {
            throw new BusinessException(ATTENDANCE_ALREADY_EXISTS,
                    traineeAttendanceDTO.getTraineeId(), traineeAttendanceDTO.getCourseSessionId());
        }

        LocalTime parsedCheckIn=traineeAttendanceDTO.getCheckInTime()!=null?LocalTime.parse(traineeAttendanceDTO.getCheckInTime()):null;
        LocalTime parsedCheckOut=traineeAttendanceDTO.getCheckOutTime()!=null?LocalTime.parse(traineeAttendanceDTO.getCheckOutTime()):null;

        if (parsedCheckIn!= null && parsedCheckOut != null) {
            if (parsedCheckIn.isAfter(parsedCheckOut)) {
                throw new BusinessException(CHECK_IN_TIME_AFTER_CHECK_OUT_TIME);
            }
        }

        TraineeAttendance traineeAttendance = traineeMapper.toTraineeAttendance(traineeAttendanceDTO);
        traineeAttendance.setStatus(traineeAttendanceDTO.getStatus()!=null?traineeAttendanceDTO.getStatus().getId():TraineeAttendanceStatus.PRESENT.getId());
        if (traineeAttendanceDTO.getAttendanceDate() != null) {
            traineeAttendance.setAttendanceDate(traineeAttendanceDTO.getAttendanceDate());
        } else {
            traineeAttendance.setAttendanceDate(LocalDate.now());
        }
        traineeAttendance = traineeAttendanceRepository.insert(traineeAttendance);

        log.info("Trainee attendance created with id: {}", traineeAttendance.getId());
        return NewRecordVTO.builder().id(traineeAttendance.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateTraineeAttendance(Integer attendanceId, TraineeAttendanceDTO traineeAttendanceDTO) {
        log.info("Updating trainee attendance with id: {}", attendanceId);

        TraineeAttendance traineeAttendance = traineeAttendanceRepository.selectById(attendanceId)
                .orElseThrow(() -> new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId));

        LocalTime parsedCheckIn=traineeAttendanceDTO.getCheckInTime()!=null?LocalTime.parse(traineeAttendanceDTO.getCheckInTime()):null;
        LocalTime parsedCheckOut=traineeAttendanceDTO.getCheckOutTime()!=null?LocalTime.parse(traineeAttendanceDTO.getCheckOutTime()):null;

        if (parsedCheckIn != null && parsedCheckOut != null) {
            if (parsedCheckIn.isAfter(parsedCheckOut)) {
                throw new BusinessException(CHECK_IN_TIME_AFTER_CHECK_OUT_TIME);
            }
        }

        traineeAttendance.setStatus(traineeAttendanceDTO.getStatus().getId());
        traineeAttendance.setCheckInTime(parsedCheckIn);
        traineeAttendance.setCheckOutTime(parsedCheckOut);
        traineeAttendance.setLateTime(traineeAttendanceDTO.getLateTime());
        traineeAttendance.setNote(traineeAttendanceDTO.getNote());

        if (traineeAttendanceDTO.getAttendanceDate() != null) {
            traineeAttendance.setAttendanceDate(traineeAttendanceDTO.getAttendanceDate());
        }

        traineeAttendanceRepository.update(traineeAttendance);

        log.info("Trainee attendance updated with id: {}", attendanceId);
        return NewRecordVTO.builder().id(attendanceId).build();
    }

    @Override
    @Transactional
    public void deleteTraineeAttendanceById(Integer attendanceId) {
        log.info("Deleting trainee attendance with id: {}", attendanceId);

        TraineeAttendance traineeAttendance = traineeAttendanceRepository.selectById(attendanceId)
                .orElseThrow(() -> new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId));

        traineeAttendanceRepository.softDeleteById(attendanceId);

        log.info("Trainee attendance deleted with id: {}", attendanceId);
    }

    @Override
    public TraineeAttendanceVTO getTraineeAttendanceById(Integer attendanceId) {
        log.info("Getting trainee attendance with id: {}", attendanceId);

        TraineeAttendance traineeAttendance = traineeAttendanceRepository.selectById(attendanceId)
                .orElseThrow(() -> new BusinessException(ATTENDANCE_NOT_FOUND, attendanceId));
        TraineeAttendanceVTO traineeAttendanceVTO=traineeMapper.toTraineeAttendanceVTO(traineeAttendance);
        System.out.printf("Trainee attendance found with " + traineeAttendanceVTO);
        return traineeAttendanceVTO;
    }

    // ==================== Query Operations (All using selectAllByFilters) ====================

    @Override
    public TraineeAttendanceResultSet getAllTraineeAttendances(TraineeAttendanceStatus status,String sessionDay, String traineeNationalId, Integer traineeId, Integer courseId, Integer courseSessionId, String quickSearch, String checkInFrom, String checkInTo, String checkOutFrom, String checkOutTo, LocalDate fromDate, LocalDate toDate, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        log.info("Getting all trainee attendances with filters");

        TraineeAttendanceSearchFilter filter = TraineeAttendanceSearchFilter.builder()
                .traineeId(traineeId)
                .courseId(courseId)
                .courseSessionId(courseSessionId)
                .traineeNationalId(traineeNationalId)
                .quickSearch(quickSearch)
                .sessionDay(sessionDay)
                .checkInFrom(checkInFrom!=null?LocalTime.parse(checkInFrom):null)
                .checkInTo(checkInTo!=null?LocalTime.parse(checkInTo):null)
                .checkOutFrom(checkOutFrom!=null ? LocalTime.parse(checkOutFrom):null)
                .checkOutTo(checkOutTo!=null ? LocalTime.parse(checkOutTo):null)
                .status(status != null ? status.getId() : null)
                .attendanceDateFrom(fromDate)
                .attendanceDateTo(toDate)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TraineeAttendanceSearchFilter.OrderByAttributes.ATTENDANCE_DATE, OrderDirections.DESC))
                .sorting(orderBy != null ? new SortingInfo<>(orderBy, orderDir) : null)
                .build();

        List<TraineeAttendance> attendances = traineeAttendanceRepository.selectAllByFilters(filter);
        List<TraineeAttendanceListItem> items = traineeMapper.toTraineeAttendanceListItems(attendances);

        Integer total = traineeAttendanceRepository.countAllByFilters(filter);

        return TraineeAttendanceResultSet.builder()
                .items(items)
                .total(total != null ? total : items.size())
                .build();
    }

    // ==================== Report Operations (Using selectAllByFilters) ====================

    @Override
    public DailyAttendanceReport getDailyAttendanceReport(LocalDate attendanceDate) {
        log.info("Getting daily attendance report for date: {}", attendanceDate);

        TraineeAttendanceSearchFilter filter = TraineeAttendanceSearchFilter.builder()
                .attendanceDateFrom(attendanceDate)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<TraineeAttendance> attendances = traineeAttendanceRepository.selectAllByFilters(filter);

        long totalTrainees = attendances.size();
        long present = attendances.stream()
                .filter(a -> a.getStatus() .equals(TraineeAttendanceStatus.PRESENT.getId()))
                .count();
        long absent = attendances.stream()
                .filter(a -> a.getStatus() .equals(TraineeAttendanceStatus.ABSENT.getId()))
                .count();
        long late = attendances.stream()
                .filter(a -> a.getStatus() .equals(TraineeAttendanceStatus.LATE.getId()))
                .count();
        long excused = attendances.stream()
                .filter(a -> a.getStatus() .equals(TraineeAttendanceStatus.EXCUSED.getId()))
                .count();

        double attendanceRate = totalTrainees > 0
                ? (double) (present + late) / totalTrainees * 100
                : 0;

        List<TraineeAttendanceListItem> details = traineeMapper.toTraineeAttendanceListItems(attendances);

        return DailyAttendanceReport.builder()
                .attendanceDate(attendanceDate)
                .totalNumber((int) totalTrainees)
                .present((int) present)
                .absent((int) absent)
                .late((int) late)
                .excused((int) excused)
                .attendanceRate(attendanceRate)
                .details(details)
                .build();
    }

    @Override
    public SessionAttendanceReport getSessionAttendanceReport(Integer sessionId) {
        log.info("Getting session attendance report for sessionId: {}", sessionId);

        TraineeAttendanceSearchFilter filter = TraineeAttendanceSearchFilter.builder()
                .courseSessionId(sessionId)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<TraineeAttendance> attendances = traineeAttendanceRepository.selectAllByFilters(filter);

        if (attendances.isEmpty()) {
            throw new BusinessException(NO_ATTENDANCE_FOR_SESSION, sessionId);
        }

        TraineeAttendance firstAttendance = attendances.get(0);
        String sessionTitle = firstAttendance.getCourseSession().getTitle();
        LocalDate sessionDate = firstAttendance.getCourseSession().getSessionDate();

        long totalTrainees = attendances.size();
        long present = attendances.stream()
                .filter(a -> a.getStatus() .equals(TraineeAttendanceStatus.PRESENT.getId()))
                .count();
        long absent = attendances.stream()
                .filter(a -> a.getStatus() .equals( TraineeAttendanceStatus.ABSENT.getId()))
                .count();
        long late = attendances.stream()
                .filter(a -> a.getStatus() .equals( TraineeAttendanceStatus.LATE.getId()))
                .count();
        long excused = attendances.stream()
                .filter(a -> a.getStatus() .equals( TraineeAttendanceStatus.EXCUSED.getId()))
                .count();

        double attendanceRate = totalTrainees > 0
                ? (double) (present + late) / totalTrainees * 100
                : 0;

        List<TraineeAttendanceListItem> details = traineeMapper.toTraineeAttendanceListItems(attendances);

        return SessionAttendanceReport.builder()
                .sessionId(sessionId)
                .sessionTitle(sessionTitle)
                .sessionDate(sessionDate)
                .totalTrainees((int) totalTrainees)
                .present((int) present)
                .absent((int) absent)
                .late((int) late)
                .excused((int) excused)
                .attendanceRate(attendanceRate)
                .details(details)
                .build();
    }

    // ==================== Batch Operations ====================

    @Override
    @Transactional
    public List<NewRecordVTO> batchCreateTraineeAttendances(List<TraineeAttendanceDTO> attendances) {
        log.info("Batch creating {} trainee attendances", attendances.size());

        List<NewRecordVTO> results = attendances.stream()
                .map(this::createTraineeAttendance)
                .collect(Collectors.toList());

        log.info("Batch created {} trainee attendances", results.size());
        return results;
    }

    // ==================== Lookup Operations ====================

    @Override
    public LookupResultSet getTraineeAttendanceStatusLookup() {
        log.info("Getting trainee attendance status lookup");

        List<LookupVTO> list = List.of(
                LookupVTO.builder().id(1).title("حاضر").build(),
                LookupVTO.builder().id(2).title("غائب").build(),
                LookupVTO.builder().id(3).title("متأخر").build(),
                LookupVTO.builder().id(4).title("معذور").build()
        );

        return LookupResultSet.builder()
                ._list(list)
                .total(list.size())
                .build();
    }
}