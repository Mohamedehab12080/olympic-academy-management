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
import bs.service.place.model.entity.Place;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

import static bs.service.employee.model.enums.EmployeeErrors.*;

@Slf4j
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
    public List<NewRecordVTO> updateCourseSession(CourseSessionDTO courseSessionDTO) {
        List<NewRecordVTO> newRecordVTOSToBeReturned = new ArrayList<>();

        // ==========================================================================
        // STEP 1: VALIDATE INPUT
        // ==========================================================================

        // Validate course exists
        Course course = courseRepository.selectById(courseSessionDTO.getCourseId())
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, courseSessionDTO.getCourseId()));

        // Validate place exists
        placeRepository.selectById(courseSessionDTO.getPlaceId())
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND_FOR_SESSION, courseSessionDTO.getPlaceId()));

        // Validate time
        LocalTime startTime = LocalTime.parse(courseSessionDTO.getStartTime());
        LocalTime endTime = LocalTime.parse(courseSessionDTO.getEndTime());
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new BusinessException(START_TIME_AFTER_END_TIME);
        }

        // Get session days
        List<String> sessionDays = courseSessionDTO.getSessionDays();
        if (sessionDays == null || sessionDays.isEmpty()) {
            throw new BusinessException(SESSION_DAYS_REQUIRED);
        }

        // Validate trainers list
        if (courseSessionDTO.getTrainersId() == null || courseSessionDTO.getTrainersId().isEmpty()) {
            throw new BusinessException(TRAINERS_REQUIRED);
        }

        // Get all trainers
        List<Employee> newTrainers = employeeRepository.selectAllById(courseSessionDTO.getTrainersId());
        if (newTrainers == null || newTrainers.size() != courseSessionDTO.getTrainersId().size()) {
            throw new BusinessException(EMPLOYEE_NOT_FOUND, courseSessionDTO.getTrainersId());
        }

        // ==========================================================================
        // STEP 2: GET EXISTING SESSIONS FOR THIS COURSE
        // ==========================================================================

        CourseSessionSearchFilter existingFilter = CourseSessionSearchFilter.builder()
                .courseId(courseSessionDTO.getCourseId())
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> existingSessions = courseSessionRepository.selectAllByFilters(existingFilter);

        // Group existing sessions by trainer ID
        Map<Integer, List<CourseSession>> existingSessionsByTrainer = new HashMap<>();
        Set<Integer> existingTrainerIds = new HashSet<>();

        for (CourseSession session : existingSessions) {
            Integer trainerId = session.getTrainer().getId();
            existingTrainerIds.add(trainerId);
            existingSessionsByTrainer.computeIfAbsent(trainerId, k -> new ArrayList<>()).add(session);
        }

        // ==========================================================================
        // STEP 3: DETERMINE CHANGES (ADD, REMOVE, KEEP)
        // ==========================================================================

        Set<Integer> newTrainerIds = new HashSet<>(courseSessionDTO.getTrainersId());

        // Trainers to REMOVE (exist in DB but not in new list)
        Set<Integer> trainersToRemove = new HashSet<>(existingTrainerIds);
        trainersToRemove.removeAll(newTrainerIds);

        // Trainers to ADD (in new list but not in DB)
        Set<Integer> trainersToAdd = new HashSet<>(newTrainerIds);
        trainersToAdd.removeAll(existingTrainerIds);

        // Trainers to KEEP (exist in both)
        Set<Integer> trainersToKeep = new HashSet<>(existingTrainerIds);
        trainersToKeep.retainAll(newTrainerIds);

        // ==========================================================================
        // STEP 4: VALIDATE CONFLICTS
        // ==========================================================================

        // 4A: Check duplicate trainer-day combinations within the request
        // Same trainer cannot have the same day twice in the same request
        validateNoDuplicateTrainerDayInRequest(newTrainers, sessionDays);

        // 4B: Check for overlapping time conflicts for each trainer
        // A trainer cannot have overlapping sessions on the same day
        validateTrainerTimeOverlaps(newTrainers, sessionDays, startTime, endTime,
                courseSessionDTO.getCourseId());

        // 4C: Check place availability (excluding sessions from this course)
        validatePlaceAvailability(courseSessionDTO.getPlaceId(), sessionDays, startTime, endTime,
                courseSessionDTO.getCourseId());

        // ==========================================================================
        // STEP 5: EXECUTE UPDATES
        // ==========================================================================

        // Track all affected trainer IDs for logging
        Set<Integer> allAffectedTrainerIds = new HashSet<>();
        allAffectedTrainerIds.addAll(trainersToKeep);
        allAffectedTrainerIds.addAll(trainersToRemove);
        allAffectedTrainerIds.addAll(trainersToAdd);

        // 5A: UPDATE existing sessions for trainers to KEEP
        if (!trainersToKeep.isEmpty()) {
            for (Integer trainerId : trainersToKeep) {
                List<CourseSession> trainerSessions = existingSessionsByTrainer.get(trainerId);

                if (trainerSessions != null && !trainerSessions.isEmpty()) {
                    // Get existing days for this trainer
                    Set<String> existingDays = trainerSessions.stream()
                            .map(CourseSession::getSessionDay)
                            .collect(Collectors.toSet());

                    // Days to REMOVE (exist but not in new list)
                    Set<String> daysToRemove = new HashSet<>(existingDays);
                    daysToRemove.removeAll(sessionDays);

                    // Days to ADD (in new list but not existing)
                    Set<String> daysToAdd = new HashSet<>(sessionDays);
                    daysToAdd.removeAll(existingDays);

                    // Days to KEEP (exist in both)
                    Set<String> daysToKeep = new HashSet<>(existingDays);
                    daysToKeep.retainAll(sessionDays);

                    // === Update sessions for days to KEEP ===
                    if (!daysToKeep.isEmpty()) {
                        updateExistingSessions(trainerSessions, daysToKeep, courseSessionDTO, startTime, endTime);
                    }

                    // === Delete sessions for days to REMOVE ===
                    if (!daysToRemove.isEmpty()) {
                        deleteSessions(trainerSessions, daysToRemove);
                    }

                    // === Create sessions for days to ADD ===
                    if (!daysToAdd.isEmpty()) {
                        Employee trainer = employeeRepository.selectById(trainerId)
                                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

                        List<CourseSession> newSessions = createSessionsForTrainer(
                                course, trainer, new ArrayList<>(daysToAdd), startTime, endTime, courseSessionDTO);

                        for (CourseSession newSession : newSessions) {
                            newSession = courseSessionRepository.insert(newSession);
                            newRecordVTOSToBeReturned.add(NewRecordVTO.builder()
                                    .id(newSession.getId())
                                    .build());
                        }
                    }
                } else {
                    // This should not happen, but handle gracefully - trainer exists in DB but no sessions
                    Employee trainer = employeeRepository.selectById(trainerId)
                            .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

                    List<CourseSession> newSessions = createSessionsForTrainer(
                            course, trainer, sessionDays, startTime, endTime, courseSessionDTO);

                    for (CourseSession newSession : newSessions) {
                        newSession = courseSessionRepository.insert(newSession);
                        newRecordVTOSToBeReturned.add(NewRecordVTO.builder()
                                .id(newSession.getId())
                                .build());
                    }
                }
            }
        }

        // 5B: DELETE sessions for trainers to REMOVE
        if (!trainersToRemove.isEmpty()) {
            for (Integer trainerId : trainersToRemove) {
                List<CourseSession> sessionsToRemove = existingSessionsByTrainer.get(trainerId);
                if (sessionsToRemove != null && !sessionsToRemove.isEmpty()) {
                    deleteSessions(sessionsToRemove, null);
                }
            }
        }

        // 5C: CREATE new sessions for trainers to ADD
        if (!trainersToAdd.isEmpty()) {
            for (Integer trainerId : trainersToAdd) {
                Employee trainer = employeeRepository.selectById(trainerId)
                        .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

                List<CourseSession> newSessions = createSessionsForTrainer(
                        course, trainer, sessionDays, startTime, endTime, courseSessionDTO);

                for (CourseSession newSession : newSessions) {
                    newSession = courseSessionRepository.insert(newSession);
                    newRecordVTOSToBeReturned.add(NewRecordVTO.builder()
                            .id(newSession.getId())
                            .build());
                }
            }
        }

        // ==========================================================================
        // STEP 6: LOG AND RETURN
        // ==========================================================================

        log.info("=== Course Session Update Summary ===");
        log.info("Course ID: {}", courseSessionDTO.getCourseId());
        log.info("Course Title: {}", course.getTitle());
        log.info("Session Days: {}", sessionDays);
        log.info("Time: {} - {}", startTime, endTime);
        log.info("Total trainers in request: {}", newTrainerIds.size());
        log.info("  Trainers KEPT: {}", trainersToKeep);
        log.info("  Trainers REMOVED: {}", trainersToRemove);
        log.info("  Trainers ADDED: {}", trainersToAdd);
        log.info("  Total affected trainers: {}", allAffectedTrainerIds.size());
        log.info("  New sessions created: {}", newRecordVTOSToBeReturned.size());
        log.info("=====================================");

        return newRecordVTOSToBeReturned;
    }

// ==========================================================================
// HELPER METHODS
// ==========================================================================

    /**
     * Validate no duplicate trainer-day combinations within the same request
     * Each trainer can have each day only once in the SAME request
     * (Different courses can have the same trainer on the same day with different times)
     */
    private void validateNoDuplicateTrainerDayInRequest(List<Employee> trainers, List<String> sessionDays) {
        Set<String> combinations = new HashSet<>();
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                String combination = trainer.getId() + "-" + day;
                if (combinations.contains(combination)) {
                    throw new BusinessException(DUPLICATE_TRAINER_DAY_IN_REQUEST, trainer.getId(), day);
                }
                combinations.add(combination);
            }
        }
    }

    /**
     * Validate that trainers don't have overlapping sessions on the same day
     * A trainer can have multiple sessions on the same day, but they must not overlap
     *
     * Example:
     * ✅ Trainer A: Monday 3:00-4:00, Monday 5:00-6:00 (allowed - different times)
     * ❌ Trainer A: Monday 3:00-4:00, Monday 3:30-4:30 (not allowed - overlapping)
     * ✅ Trainer A: Monday 3:00-4:00, Tuesday 3:00-4:00 (allowed - different days)
     */
    private void validateTrainerTimeOverlaps(List<Employee> trainers, List<String> sessionDays,
                                             LocalTime startTime, LocalTime endTime, Integer courseId) {
        for (Employee trainer : trainers) {
            for (String day : sessionDays) {
                // Check if this trainer already has a session on this day with overlapping time
                CourseSessionSearchFilter conflictFilter = CourseSessionSearchFilter.builder()
                        .employeeId(trainer.getId())
                        .sessionDay(day)
                        .startTimeFrom(startTime)
                        .startTimeTo(endTime)
                        .pagination(PaginationInfo.noPagination())
                        .build();

                List<CourseSession> conflictingSessions = courseSessionRepository
                        .selectAllByFilters(conflictFilter);

                if (conflictingSessions != null && !conflictingSessions.isEmpty()) {
                    for (CourseSession conflicting : conflictingSessions) {
                        // Skip if this session belongs to the same course (we're updating it)
                        if (conflicting.getCourse().getId().equals(courseId)) {
                            continue;
                        }

                        // Check if the time overlaps
                        boolean overlap = !(endTime.isBefore(conflicting.getStartTime()) ||
                                startTime.isAfter(conflicting.getEndTime()));

                        if (overlap) {
                            // Same trainer, same day, overlapping times - NOT ALLOWED
                            throw new BusinessException(TRAINER_HAS_OVERLAPPING_SESSION,
                                    trainer.getId(), day,
                                    conflicting.getStartTime(), conflicting.getEndTime());
                        }
                        // Different time on same day - ALLOWED
                    }
                }
            }
        }
    }

    /**
     * Validate place availability across all sessions (excluding current course)
     * A place can only have ONE session at the same time on the same day
     */
    private void validatePlaceAvailability(Integer placeId, List<String> sessionDays,
                                           LocalTime startTime, LocalTime endTime, Integer courseId) {
        for (String day : sessionDays) {
            CourseSessionSearchFilter conflictFilter = CourseSessionSearchFilter.builder()
                    .placeId(placeId)
                    .sessionDay(day)
                    .startTimeFrom(startTime)
                    .startTimeTo(endTime)
                    .pagination(PaginationInfo.noPagination())
                    .build();

            List<CourseSession> conflictingSessions = courseSessionRepository
                    .selectAllByFilters(conflictFilter);

            if (conflictingSessions != null && !conflictingSessions.isEmpty()) {
                for (CourseSession conflicting : conflictingSessions) {
                    // Skip if this session belongs to the same course (we're updating it)
                    if (conflicting.getCourse().getId().equals(courseId)) {
                        continue;
                    }

                    // Check if the time overlaps
                    boolean overlap = !(endTime.isBefore(conflicting.getStartTime()) ||
                            startTime.isAfter(conflicting.getEndTime()));

                    if (overlap) {
                        throw new BusinessException(PLACE_ALREADY_BOOKED, placeId, day);
                    }
                }
            }
        }
    }

    /**
     * Update existing sessions with new values
     */
    private void updateExistingSessions(List<CourseSession> sessions, Set<String> daysToKeep,
                                        CourseSessionDTO dto, LocalTime startTime, LocalTime endTime) {
        for (CourseSession session : sessions) {
            if (daysToKeep.contains(session.getSessionDay())) {
                // Update basic fields
                session.setPlace(Place.builder().id(dto.getPlaceId()).build());
                session.setStartTime(startTime);
                session.setEndTime(endTime);

                // Update status if provided
                if (dto.getStatus() != null) {
                    session.setStatus(dto.getStatus().getId());
                }

                // Update optional fields
                if (dto.getTitle() != null) {
                    session.setTitle(dto.getTitle());
                }
                if (dto.getNote() != null) {
                    session.setNote(dto.getNote());
                }


                courseSessionRepository.update(session);
            }
        }
    }

    /**
     * Delete sessions for specific days or all sessions
     */
    private void deleteSessions(List<CourseSession> sessions, Set<String> daysToRemove) {
        for (CourseSession session : sessions) {
            if (daysToRemove == null || daysToRemove.contains(session.getSessionDay())) {
                courseSessionRepository.delete(session.getId());
            }
        }
    }

    /**
     * Create sessions for a trainer
     */
    private List<CourseSession> createSessionsForTrainer(Course course, Employee trainer,
                                                         List<String> days, LocalTime startTime,
                                                         LocalTime endTime, CourseSessionDTO dto) {
        List<CourseSession> sessions = new ArrayList<>();

        for (String day : days) {
            CourseSession session = createSessionEntity(course, trainer, day, startTime, endTime, dto);
            sessions.add(session);
        }

        return sessions;
    }

    /**
     * Create a single session entity
     */
    private CourseSession createSessionEntity(Course course, Employee trainer, String day,
                                              LocalTime startTime, LocalTime endTime,
                                              CourseSessionDTO dto) {
        CourseSession session = new CourseSession();
        session.setCourse(course);
        session.setTrainer(trainer);
        session.setPlace(Place.builder().id(dto.getPlaceId()).build());
        session.setSessionDay(day);
        session.setStartTime(startTime);
        session.setEndTime(endTime);
        session.setStatus(dto.getStatus() != null ? dto.getStatus().getId() : SessionStatus.IN_PROGRESS.getId());
        session.setIsDeleted(false);

        // Set optional fields
        if (dto.getTitle() != null) {
            session.setTitle(dto.getTitle());
        }
        if (dto.getNote() != null) {
            session.setNote(dto.getNote());
        }

        return session;
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
    public CourseSessionResultSet getAllCourseSessionsByFilter(Integer courseId,List<Integer>trainerIds,String sessionDay, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .groupByCourse(courseId!=null ? true: null)
                .groupByTrainer(trainerIds!=null ? true: null)
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
    public CourseSessionResultSet getAllSessionsByFilter(Integer courseId,List<Integer>trainerIds,String sessionDay, Integer trainerId, Integer placeId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        validateService.validateFromToFilters(sessionDateFrom,sessionDateTo);

        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .employeeId(trainerId)
                .sessionDay(sessionDay)
                .groupByCourse(courseId!=null ? true: null)
                .groupByTrainer(trainerId!=null ? true: null)
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