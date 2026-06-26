package bs.service.employee.core.service;

import bs.lib.common.api.service.ValidateService;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
import bs.service.course.model.entity.Course;
import bs.service.employee.api.repository.CourseSessionRepository;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.service.CourseSessionService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.CourseSession;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.filter.CourseSessionSearchFilter;
import bs.service.employee.model.generated.CourseSessionDTO;
import bs.service.employee.model.generated.CourseSessionResultSet;
import bs.service.employee.model.generated.CourseSessionVTO;
import bs.service.place.api.repository.PlaceRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static bs.service.employee.model.enums.EmployeeErrors.*;

@Service
@AllArgsConstructor
public class CourseSessionServiceImpl implements CourseSessionService {

    private final CourseSessionRepository courseSessionRepository;
    private final CourseRepository courseRepository;
    private final EmployeeRepository employeeRepository;
    private final PlaceRepository placeRepository;
    private final EmployeeMapper employeeMapper;
    private final ValidateService validateService;

    @Override
    @Transactional
    public List<NewRecordVTO> createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO) {
        List<NewRecordVTO> newRecordVTOSToBeReturned = new ArrayList<>();

        // Validate course exists
        courseRepository.selectById(courseId)
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, courseId));

        // Get trainers
        List<Employee> trainers = employeeRepository.selectAllById(courseSessionDTO.getTrainersId());
        if (trainers == null || trainers.size() != courseSessionDTO.getTrainersId().size() || trainers.isEmpty()) {
            throw new BusinessException(EMPLOYEE_NOT_FOUND, courseSessionDTO.getTrainersId());
        }

        // Validate place exists
        placeRepository.selectById(courseSessionDTO.getPlaceId())
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND_FOR_SESSION, courseSessionDTO.getPlaceId()));

        // Validate time
        LocalTime startTime = LocalTime.parse(courseSessionDTO.getStartTime());
        LocalTime endTime = LocalTime.parse(courseSessionDTO.getEndTime());
        if (startTime.isAfter(endTime)) {
            throw new BusinessException(START_TIME_AFTER_END_TIME);
        }

        // Get session days
        List<String> sessionDays = courseSessionDTO.getSessionDays();

        // CRITICAL VALIDATION 1: Check for duplicate trainer-day combinations
        Set<String> combinations = new HashSet<>();
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                String combination = trainer.getId() + "-" + day + "-" + startTime;
                if (combinations.contains(combination)) {
                    throw new BusinessException(DUPLICATE_TRAINER_DAY_COMBINATION, trainer.getId(), day);
                }
                combinations.add(combination);
            }
        }

        // CRITICAL VALIDATION 2: Check if trainer already has session on same day and overlapping time
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                // Find sessions that overlap with the requested time range
                CourseSessionSearchFilter courseSessionSearchFilter = CourseSessionSearchFilter.builder()
                        .employeeId(trainer.getId())
                        .sessionDay(day)
                        // Find sessions where startTime < endTime AND endTime > startTime
                        .startTimeFrom(startTime)  // sessions that start before or at the requested end time
                        .startTimeTo(endTime)      // sessions that end after or at the requested start time
                        .pagination(PaginationInfo.noPagination())
                        .build();

                List<CourseSession> existingSessions = courseSessionRepository
                        .selectAllByFilters(courseSessionSearchFilter);

                if (existingSessions != null && !existingSessions.isEmpty()) {
                    // Double-check overlapping to be safe
                    for (CourseSession existing : existingSessions) {
                        boolean overlap = !(endTime.isBefore(existing.getStartTime()) ||
                                startTime.isAfter(existing.getEndTime()));
                        if (overlap) {
                            throw new BusinessException(TRAINER_ALREADY_BOOKED, trainer.getId(), day);
                        }
                    }
                }
            }
        }

        // CRITICAL VALIDATION 3: Check if place already has session on same day and overlapping time
        for (String day : sessionDays) {
            CourseSessionSearchFilter courseSessionSearchFilter = CourseSessionSearchFilter.builder()
                    .placeId(courseSessionDTO.getPlaceId())
                    .sessionDay(day)
                    // Find sessions that overlap with the requested time range
                    .startTimeFrom(startTime)  // sessions that start before or at the requested end time
                    .startTimeTo(endTime)      // sessions that end after or at the requested start time
                    .pagination(PaginationInfo.noPagination())
                    .build();

            List<CourseSession> existingSessions = courseSessionRepository
                    .selectAllByFilters(courseSessionSearchFilter);

            if (existingSessions != null && !existingSessions.isEmpty()) {
                // Double-check overlapping to be safe
                for (CourseSession existing : existingSessions) {
                    boolean overlap = !(endTime.isBefore(existing.getStartTime()) ||
                            startTime.isAfter(existing.getEndTime()));
                    if (overlap) {
                        throw new BusinessException(PLACE_ALREADY_BOOKED, courseSessionDTO.getPlaceId(), day);
                    }
                }
            }
        }

        // Create course sessions for each trainer and each day
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                CourseSession courseSession = employeeMapper.toCourseSession(courseSessionDTO);
                courseSession.setCourse(Course.builder().id(courseId).build());
                courseSession.setTrainer(trainer);
                courseSession.setSessionDay(day);
                courseSession.setStartTime(startTime);
                courseSession.setEndTime(endTime);

                courseSession = courseSessionRepository.insert(courseSession);
                newRecordVTOSToBeReturned.add(NewRecordVTO.builder()
                        .id(courseSession.getId())
                        .build());
            }
        }

        return newRecordVTOSToBeReturned;
    }

    @Override
    @Transactional
    public List<NewRecordVTO> updateCourseSession(Integer courseSessionId, CourseSessionDTO courseSessionDTO) {
        List<NewRecordVTO> newRecordVTOSToBeReturned = new ArrayList<>();

        // Validate course session exists
        CourseSession existingSession = courseSessionRepository.selectById(courseSessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, courseSessionId));

        // Validate course exists
        courseRepository.selectById(courseSessionDTO.getCourseId())
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, courseSessionDTO.getCourseId()));

        // Get trainers
        List<Employee> trainers = employeeRepository.selectAllById(courseSessionDTO.getTrainersId());
        if (trainers == null || trainers.size() != courseSessionDTO.getTrainersId().size() || trainers.isEmpty()) {
            throw new BusinessException(EMPLOYEE_NOT_FOUND, courseSessionDTO.getTrainersId());
        }

        // Validate place exists
        placeRepository.selectById(courseSessionDTO.getPlaceId())
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND_FOR_SESSION, courseSessionDTO.getPlaceId()));

        // Validate time
        LocalTime startTime = LocalTime.parse(courseSessionDTO.getStartTime());
        LocalTime endTime = LocalTime.parse(courseSessionDTO.getEndTime());
        if (startTime.isAfter(endTime)) {
            throw new BusinessException(START_TIME_AFTER_END_TIME);
        }

        // Get session days
        List<String> sessionDays = courseSessionDTO.getSessionDays();

        // CRITICAL VALIDATION 1: Check for duplicate trainer-day combinations within the same request
        Set<String> combinations = new HashSet<>();
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                String combination = trainer.getId() + "-" + day + "-" + startTime;
                if (combinations.contains(combination)) {
                    throw new BusinessException(DUPLICATE_TRAINER_DAY_COMBINATION, trainer.getId(), day);
                }
                combinations.add(combination);
            }
        }

        // CRITICAL VALIDATION 2: Check if trainer already has session on same day and overlapping time
        // Exclude all sessions that belong to this course session group
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                CourseSessionSearchFilter courseSessionSearchFilter = CourseSessionSearchFilter.builder()
                        .employeeId(trainer.getId())
                        .sessionDay(day)
                        .startTimeFrom(startTime)
                        .startTimeTo(endTime)
                        .pagination(PaginationInfo.noPagination())
                        .build();

                List<CourseSession> existingSessions = courseSessionRepository
                        .selectAllByFilters(courseSessionSearchFilter);

                if (existingSessions != null && !existingSessions.isEmpty()) {
                    for (CourseSession existing : existingSessions) {
                        // Skip if this session belongs to the same course and has same trainer and day
                        // This prevents conflict with sessions that are being updated
                        if (existing.getCourse().getId().equals(courseSessionDTO.getCourseId()) &&
                                existing.getTrainer().getId().equals(trainer.getId()) &&
                                existing.getSessionDay().equals(day)) {
                            continue;
                        }

                        boolean overlap = !(endTime.isBefore(existing.getStartTime()) ||
                                startTime.isAfter(existing.getEndTime()));
                        if (overlap) {
                            throw new BusinessException(TRAINER_ALREADY_BOOKED, trainer.getId(), day);
                        }
                    }
                }
            }
        }

        // CRITICAL VALIDATION 3: Check if place already has session on same day and overlapping time
        // Exclude all sessions that belong to this course session group
        for (String day : sessionDays) {
            CourseSessionSearchFilter courseSessionSearchFilter = CourseSessionSearchFilter.builder()
                    .placeId(courseSessionDTO.getPlaceId())
                    .sessionDay(day)
                    .startTimeFrom(startTime)
                    .startTimeTo(endTime)
                    .pagination(PaginationInfo.noPagination())
                    .build();

            List<CourseSession> existingSessions = courseSessionRepository
                    .selectAllByFilters(courseSessionSearchFilter);

            if (existingSessions != null && !existingSessions.isEmpty()) {
                for (CourseSession existing : existingSessions) {
                    // Skip if this session belongs to the same course and has same place and day
                    if (existing.getCourse().getId().equals(courseSessionDTO.getCourseId()) &&
                            existing.getPlace().getId().equals(courseSessionDTO.getPlaceId()) &&
                            existing.getSessionDay().equals(day)) {
                        continue;
                    }

                    boolean overlap = !(endTime.isBefore(existing.getStartTime()) ||
                            startTime.isAfter(existing.getEndTime()));
                    if (overlap) {
                        throw new BusinessException(PLACE_ALREADY_BOOKED, courseSessionDTO.getPlaceId(), day);
                    }
                }
            }
        }

        // Delete all existing sessions for this course with the same trainer and day combinations
        // First, find all sessions to delete
        List<CourseSession> sessionsToDelete = new ArrayList<>();
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                CourseSessionSearchFilter searchFilter = CourseSessionSearchFilter.builder()
                        .courseId(courseSessionDTO.getCourseId())
                        .employeeId(trainer.getId())
                        .sessionDay(day)
                        .pagination(PaginationInfo.noPagination())
                        .build();

                List<CourseSession> existingSessions = courseSessionRepository
                        .selectAllByFilters(searchFilter);

                if (existingSessions != null && !existingSessions.isEmpty()) {
                    sessionsToDelete.addAll(existingSessions);
                }
            }
        }

        // Delete the sessions
        for (CourseSession session : sessionsToDelete) {
            courseSessionRepository.delete(session.getId());
        }

        // Create new course sessions for each trainer and each day
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                CourseSession courseSession = employeeMapper.toCourseSession(courseSessionDTO);
                courseSession.setCourse(Course.builder().id(courseSessionDTO.getCourseId()).build());
                courseSession.setTrainer(trainer);
                courseSession.setSessionDay(day);
                courseSession.setStartTime(startTime);
                courseSession.setEndTime(endTime);
                courseSession.setIsDeleted(false);
                courseSession = courseSessionRepository.insert(courseSession);
                newRecordVTOSToBeReturned.add(NewRecordVTO.builder()
                        .id(courseSession.getId())
                        .build());
            }
        }

        return newRecordVTOSToBeReturned;
    }

    @Override
    @Transactional
    public void deleteCourseSession(Integer courseSessionId) {
        CourseSession courseSession = courseSessionRepository.selectById(courseSessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, courseSessionId));
        courseSessionRepository.delete(courseSessionId);
    }

    @Override
    public CourseSessionVTO getCourseSessionById(Integer courseSessionId) {
        CourseSession courseSession = courseSessionRepository.selectById(courseSessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, courseSessionId));
        return employeeMapper.toCourseSessionVTO(courseSession);
    }

    @Override
    public CourseSessionResultSet getAllCourseSessionsByFilter(Integer courseId,String sessionDay, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .sessionDay(sessionDay)
                .status(status!=null?status.getId():null)
                .sessionDateFrom(sessionDateFrom)
                .sessionDateTo(sessionDateTo)
                .startTimeFrom(startTimeFrom!=null? LocalTime.parse(startTimeFrom):null)
                .startTimeTo(startTimeTo!=null ? LocalTime.parse(startTimeTo):null)
                .endTimeFrom(endTimeFrom!=null ? LocalTime.parse(endTimeFrom):null)
                .endTimeTo(endTimeTo!=null ? LocalTime.parse(endTimeTo):null)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(CourseSessionSearchFilter.OrderByAttributes.SESSION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);
        List<CourseSessionVTO> items = employeeMapper.toCourseSessionVTOs(sessions);

        return CourseSessionResultSet.builder()
                .items(items)
                .total(courseSessionRepository.countAllByFilters(filter))
                .build();
    }

    @Override
    public CourseSessionResultSet getAllSessionsByFilter(Integer courseId,String sessionDay, Integer trainerId, Integer placeId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        validateService.validateFromToFilters(sessionDateFrom,sessionDateTo);

        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .employeeId(trainerId)
                .sessionDay(sessionDay)
                .placeId(placeId)
                .status(status!=null?status.getId():null)
                .sessionDateFrom(sessionDateFrom)
                .sessionDateTo(sessionDateTo)
                .startTimeFrom(startTimeFrom!=null?LocalTime.parse(startTimeFrom):null)
                .startTimeTo(startTimeTo!=null ? LocalTime.parse(startTimeTo): null)
                .endTimeFrom(endTimeFrom!=null ? LocalTime.parse(endTimeFrom) : null)
                .endTimeTo(endTimeTo!=null ? LocalTime.parse(endTimeTo): null)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(CourseSessionSearchFilter.OrderByAttributes.SESSION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);
        List<CourseSessionVTO> items = employeeMapper.toCourseSessionVTOs(sessions);

        return CourseSessionResultSet.builder()
                .items(items)
                .total(courseSessionRepository.countAllByFilters(filter))
                .build();
    }
}