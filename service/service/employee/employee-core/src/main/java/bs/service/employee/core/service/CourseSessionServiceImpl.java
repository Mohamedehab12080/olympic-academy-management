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
import bs.service.employee.api.repository.TrainerCourseRepository;
import bs.service.employee.api.service.CourseSessionService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.CourseSession;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.TrainerCourse;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.enums.SessionStatus;
import bs.service.employee.model.filter.CourseSessionSearchFilter;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;
import bs.service.employee.model.generated.*;
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
    private final TrainerCourseRepository trainerCourseRepository;

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

    /**
     * DELETE: Delete all sessions for a specific day and course
     */
    @Override
    @Transactional
    public void deleteSessionsByDayAndCourse(Integer courseId, String day) {
        // Validate day is provided
        if (day == null || day.isEmpty()) {
            throw new BusinessException(SESSION_DAYS_REQUIRED);
        }

        // Get all sessions for this course and day
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .sessionDay(day)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);

        if (sessions.isEmpty()) {
            throw new BusinessException(COURSE_SESSION_NOT_FOUND, courseId, day);
        }

        // Delete all sessions
        for (CourseSession session : sessions) {
            courseSessionRepository.delete(session.getId());
        }

        log.info("Deleted {} sessions for Course ID: {}, Day: {}", sessions.size(), courseId, day);
    }

    /**
     * DELETE: Delete sessions for specific day, course, and trainers
     */
    @Override
    @Transactional
    public void deleteSessionsByDayCourseAndTrainers(Integer courseId, String day, List<Integer> trainerIds) {
        // Validate inputs
        if (day == null || day.isEmpty()) {
            throw new BusinessException(SESSION_DAYS_REQUIRED);
        }
        if (trainerIds == null || trainerIds.isEmpty()) {
            throw new BusinessException(TRAINERS_REQUIRED);
        }

        // Get sessions for this course, day, and trainers
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .sessionDay(day)
                .employeeIdsIn(trainerIds)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);

        int deletedCount = 0;
        for (CourseSession session : sessions) {
            courseSessionRepository.delete(session.getId());
        }

        log.info("Deleted {} sessions for Course ID: {}, Day: {}, Trainers: {}",
                deletedCount, courseId, day, trainerIds);
    }

    /**
     * Delete sessions for specific trainer(s) on a specific day
     */
    @Override
    @Transactional
    public void deleteSessionsByDayAndTrainer(Integer courseId, String day, List<Integer> trainerIds) {
        if (day == null || day.isEmpty()) {
            throw new BusinessException(SESSION_DAYS_REQUIRED);
        }

        if (trainerIds == null || trainerIds.isEmpty()) {
            throw new BusinessException(TRAINERS_REQUIRED);
        }

        // Get sessions matching the criteria
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .sessionDay(day)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);

        int deletedCount = 0;
        for (CourseSession session : sessions) {
            if (trainerIds.contains(session.getTrainer().getId())) {
                courseSessionRepository.delete(session.getId());
                deletedCount++;
            }
        }

        if (deletedCount == 0) {
            throw new BusinessException(COURSE_SESSION_NOT_FOUND, courseId, day, trainerIds);
        }
    }

    /**
     * Delete a specific session by its ID
     */
    @Override
    @Transactional
    public void deleteSpecificSession(Integer sessionId) {
        CourseSession session = courseSessionRepository.selectById(sessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, sessionId));
        courseSessionRepository.delete(sessionId);
    }

    /**
     * Delete all sessions for a specific day (all trainers)
     */
    @Override
    @Transactional
    public void deleteSessionsByDay(Integer courseId, String day) {
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .sessionDay(day)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);

        for (CourseSession session : sessions) {
            courseSessionRepository.delete(session.getId());
        }
    }


    // In CourseSessionService.java - Add these helper methods

    /**
     * Validate time overlaps for trainers on a specific day
     */
    private void validateTrainerTimeOverlapsForDay(List<Employee> trainers, String day,
                                                   LocalTime startTime, LocalTime endTime, Integer courseId) {
        for (Employee trainer : trainers) {
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
                    // Skip sessions from the same course (we're updating them)
                    if (conflicting.getCourse().getId().equals(courseId)) {
                        continue;
                    }

                    // Check for time overlap
                    boolean overlap = !(endTime.isBefore(conflicting.getStartTime()) ||
                            startTime.isAfter(conflicting.getEndTime()));

                    if (overlap) {
                        throw new BusinessException(TRAINER_HAS_OVERLAPPING_SESSION,
                                trainer.getId(), day,
                                conflicting.getStartTime(), conflicting.getEndTime());
                    }
                }
            }
        }
    }

    /**
     * Validate place availability for a specific day
     */
    private void validatePlaceAvailabilityForDay(Integer placeId, String day,
                                                 LocalTime startTime, LocalTime endTime, Integer courseId) {
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
                // Skip sessions from the same course (we're updating them)
                if (conflicting.getCourse().getId().equals(courseId)) {
                    continue;
                }

                boolean overlap = !(endTime.isBefore(conflicting.getStartTime()) ||
                        startTime.isAfter(conflicting.getEndTime()));

                if (overlap) {
                    throw new BusinessException(PLACE_ALREADY_BOOKED, placeId, day);
                }
            }
        }
    }

    /**
     * Validate no duplicate trainer-day in request
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

    // CourseSessionServiceImpl.java - Updated day-specific methods

    /**
     * UPDATE: Update sessions for a specific day and course
     * Uses CourseSessionDayDTO with sessionDay (singular)
     */
    @Override
    @Transactional
    public List<NewRecordVTO> updateSessionsByDayAndCourse(CourseSessionDayDTO dto) {
        List<NewRecordVTO> results = new ArrayList<>();

        // ============================================================
        // STEP 1: VALIDATE INPUT
        // ============================================================

        // Validate course exists
        Course course = courseRepository.selectById(dto.getCourseId())
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, dto.getCourseId()));

        // Validate place exists
        placeRepository.selectById(dto.getPlaceId())
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND_FOR_SESSION, dto.getPlaceId()));

        // Validate session day is provided
        String targetDay = dto.getSessionDay();
        if (targetDay == null || targetDay.isEmpty()) {
            throw new BusinessException(SESSION_DAYS_REQUIRED);
        }

        // Validate time
        LocalTime startTime = LocalTime.parse(dto.getStartTime());
        LocalTime endTime = LocalTime.parse(dto.getEndTime());
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new BusinessException(START_TIME_AFTER_END_TIME);
        }

        // Validate trainers list
        if (dto.getTrainersId() == null || dto.getTrainersId().isEmpty()) {
            throw new BusinessException(TRAINERS_REQUIRED);
        }

        // Get all trainers
        List<Employee> newTrainers = employeeRepository.selectAllById(dto.getTrainersId());
        if (newTrainers == null || newTrainers.size() != dto.getTrainersId().size()) {
            throw new BusinessException(EMPLOYEE_NOT_FOUND, dto.getTrainersId());
        }

        // ============================================================
        // STEP 2: GET EXISTING SESSIONS FOR THIS COURSE + DAY
        // ============================================================

        CourseSessionSearchFilter existingFilter = CourseSessionSearchFilter.builder()
                .courseId(dto.getCourseId())
                .sessionDay(targetDay)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> existingSessions = courseSessionRepository.selectAllByFilters(existingFilter);

        // Map existing sessions by trainer ID
        Map<Integer, CourseSession> existingSessionsByTrainer = new HashMap<>();
        for (CourseSession session : existingSessions) {
            existingSessionsByTrainer.put(session.getTrainer().getId(), session);
        }

        // ============================================================
        // STEP 3: VALIDATE CONFLICTS
        // ============================================================

        // Check for duplicate trainer-day within the request
        validateNoDuplicateTrainerDayInRequest(newTrainers, List.of(targetDay));

        // Check for time overlaps for each trainer
        validateTrainerTimeOverlapsForDay(newTrainers, targetDay, startTime, endTime, dto.getCourseId());

        // Check place availability
        validatePlaceAvailabilityForDay(dto.getPlaceId(), targetDay, startTime, endTime, dto.getCourseId());

        // ============================================================
        // STEP 4: EXECUTE UPDATES
        // ============================================================

        Set<Integer> newTrainerIds = new HashSet<>(dto.getTrainersId());

        for (Integer trainerId : newTrainerIds) {
            CourseSession existingSession = existingSessionsByTrainer.get(trainerId);

            if (existingSession != null) {
                // UPDATE existing session
                existingSession.setTitle(dto.getTitle());
                existingSession.setPlace(Place.builder().id(dto.getPlaceId()).build());
                existingSession.setStartTime(startTime);
                existingSession.setEndTime(endTime);

                if (dto.getStatus() != null) {
                    existingSession.setStatus(dto.getStatus().getId());
                }
                if (dto.getNote() != null) {
                    existingSession.setNote(dto.getNote());
                }

                courseSessionRepository.update(existingSession);
                results.add(NewRecordVTO.builder().id(existingSession.getId()).build());

            } else {
                // CREATE new session for this trainer on this day
                Employee trainer = employeeRepository.selectById(trainerId)
                        .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

                CourseSession newSession = CourseSession.builder()
                        .course(course)
                        .trainer(trainer)
                        .place(Place.builder().id(dto.getPlaceId()).build())
                        .sessionDay(targetDay)
                        .startTime(startTime)
                        .endTime(endTime)
                        .title(dto.getTitle())
                        .status(dto.getStatus() != null ?
                                dto.getStatus().getId() : SessionStatus.SCHEDULED.getId())
                        .note(dto.getNote())
                        .isDeleted(false)
                        .build();

                newSession = courseSessionRepository.insert(newSession);
                results.add(NewRecordVTO.builder().id(newSession.getId()).build());
            }
        }

        // ============================================================
        // STEP 5: DELETE SESSIONS FOR TRAINERS NO LONGER ASSIGNED
        // ============================================================

        Set<Integer> existingTrainerIds = existingSessionsByTrainer.keySet();
        Set<Integer> trainersToRemove = new HashSet<>(existingTrainerIds);
        trainersToRemove.removeAll(newTrainerIds);

        for (Integer trainerId : trainersToRemove) {
            CourseSession sessionToDelete = existingSessionsByTrainer.get(trainerId);
            if (sessionToDelete != null) {
                courseSessionRepository.delete(sessionToDelete.getId());
            }
        }

        // ============================================================
        // STEP 6: LOG AND RETURN
        // ============================================================

        log.info("=== Update Sessions By Day and Course Summary ===");
        log.info("Course ID: {}", dto.getCourseId());
        log.info("Course Title: {}", course.getTitle());
        log.info("Target Day: {}", targetDay);
        log.info("Time: {} - {}", startTime, endTime);
        log.info("Updated/Created: {} sessions", results.size());
        log.info("Removed: {} trainers", trainersToRemove.size());
        log.info("==================================================");

        return results;
    }

    /**
     * UPDATE: Update sessions for a specific day and trainers
     * Uses CourseSessionDayDTO with sessionDay (singular)
     */
    @Override
    @Transactional
    public List<NewRecordVTO> updateSessionsByDayAndTrainer(CourseSessionDayDTO dto) {
        List<NewRecordVTO> results = new ArrayList<>();

        // Validate inputs
        if (dto.getSessionDay() == null) {
            throw new BusinessException(SESSION_DAYS_REQUIRED);
        }
        if (dto.getTrainersId() == null || dto.getTrainersId().isEmpty()) {
            throw new BusinessException(TRAINERS_REQUIRED);
        }

        // Get the day to update
        String targetDay = dto.getSessionDay();
        List<Integer> trainerIds = dto.getTrainersId();

        // Validate time
        LocalTime startTime = LocalTime.parse(dto.getStartTime());
        LocalTime endTime = LocalTime.parse(dto.getEndTime());
        if (startTime.isAfter(endTime) || startTime.equals(endTime)) {
            throw new BusinessException(START_TIME_AFTER_END_TIME);
        }

        // Get existing sessions for this course
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(dto.getCourseId())
                .pagination(PaginationInfo.noPagination())
                .build();

        List<CourseSession> existingSessions = courseSessionRepository.selectAllByFilters(filter);

        // Group existing sessions by trainer ID and day
        Map<String, CourseSession> sessionMap = new HashMap<>();
        for (CourseSession session : existingSessions) {
            String key = session.getTrainer().getId() + "|" + session.getSessionDay();
            sessionMap.put(key, session);
        }

        // For each trainer, update or create session for the target day
        for (Integer trainerId : trainerIds) {
            String key = trainerId + "|" + targetDay;
            CourseSession existing = sessionMap.get(key);

            if (existing != null) {
                // Update existing session
                existing.setTitle(dto.getTitle());
                existing.setPlace(Place.builder().id(dto.getPlaceId()).build());
                existing.setStartTime(startTime);
                existing.setEndTime(endTime);

                if (dto.getStatus() != null) {
                    existing.setStatus(dto.getStatus().getId());
                }
                if (dto.getNote() != null) {
                    existing.setNote(dto.getNote());
                }

                courseSessionRepository.update(existing);
                results.add(NewRecordVTO.builder().id(existing.getId()).build());
            } else {
                // Create new session for this trainer on the target day
                Employee trainer = employeeRepository.selectById(trainerId)
                        .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));
                Course course = courseRepository.selectById(dto.getCourseId())
                        .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, dto.getCourseId()));

                CourseSession newSession = createSessionEntity(
                        course,
                        trainer,
                        targetDay,
                        startTime,
                        endTime,
                        convertToCourseSessionDTO(dto)
                );

                newSession = courseSessionRepository.insert(newSession);
                results.add(NewRecordVTO.builder().id(newSession.getId()).build());
            }
        }

        return results;
    }

// ============================================================
// HELPER METHODS FOR DAY-SPECIFIC OPERATIONS
// ============================================================

    /**
     * Convert CourseSessionDayDTO to CourseSessionDTO for reuse
     */
    private CourseSessionDTO convertToCourseSessionDTO(CourseSessionDayDTO dayDTO) {
        return CourseSessionDTO.builder()
                .title(dayDTO.getTitle())
                .courseId(dayDTO.getCourseId())
                .trainersId(dayDTO.getTrainersId())
                .placeId(dayDTO.getPlaceId())
                .sessionDay(dayDTO.getSessionDay())
                .sessionDays(List.of(dayDTO.getSessionDay()))
                .startTime(dayDTO.getStartTime())
                .endTime(dayDTO.getEndTime())
                .status(dayDTO.getStatus())
                .note(dayDTO.getNote())
                .build();
    }

    @Override
    public CourseSessionLookupVTO getCourseSessionById(Integer courseSessionId) {
        CourseSession courseSession = courseSessionRepository.selectById(courseSessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, courseSessionId));
        return employeeMapper.toCourseSessionLookupVTO(courseSession);
    }

    @Override
    public CourseSessionResultSet getAllCourseSessionsByFilter(Integer courseId,List<Integer>trainerIds,String sessionDay, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        validateService.validateFromToFilters(sessionDateFrom, sessionDateTo);

        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .sessionDay(sessionDay)
                .employeeIdsIn(trainerIds)
                .status(status != null ? status.getId() : null)
                .sessionDateFrom(sessionDateFrom)
                .sessionDateTo(sessionDateTo)
                .startTimeFrom(startTimeFrom != null ? LocalTime.parse(startTimeFrom) : null)
                .startTimeTo(startTimeTo != null ? LocalTime.parse(startTimeTo) : null)
                .endTimeFrom(endTimeFrom != null ? LocalTime.parse(endTimeFrom) : null)
                .endTimeTo(endTimeTo != null ? LocalTime.parse(endTimeTo) : null)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(CourseSessionSearchFilter.OrderByAttributes.SESSION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<CourseSession> sessions = courseSessionRepository.selectAllByFilters(filter);

        // Group sessions by courseId + sessionDay + startTime
        Map<String, List<CourseSession>> groupedSessions = sessions.stream()
                .collect(Collectors.groupingBy(session ->
                        session.getCourse().getId() + "|" +
                                session.getSessionDay() + "|" +
                                session.getStartTime().toString()
                ));

        List<CourseSessionVTO> items = new ArrayList<>();

        for (Map.Entry<String, List<CourseSession>> entry : groupedSessions.entrySet()) {
            List<CourseSession> sessionGroup = entry.getValue();

            // Get the first session for common properties
            CourseSession firstSession = sessionGroup.get(0);

            // Collect all trainers from all sessions in this group
            List<Employee> trainersForSlot = sessionGroup.stream()
                    .map(CourseSession::getTrainer)
                    .filter(Objects::nonNull)
                    .distinct() // Remove duplicates
                    .collect(Collectors.toList());

            // Create VTO
            CourseSessionVTO vto = employeeMapper.toCourseSessionVTO(firstSession);
            vto.setTrainers(employeeMapper.toLookupVTOs(trainersForSlot));

            items.add(vto);
        }

        return CourseSessionResultSet.builder()
                .items(items)
                .total(courseSessionRepository.countAllByFilters(filter))
                .build();
    }

    @Override
    public CourseSessionResultSet getAllSessionsByFilter(
            String quickSearch, Integer courseId, List<Integer> trainerIds,
            String sessionDay, Integer trainerId, Integer placeId,
            SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo,
            String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        validateService.validateFromToFilters(sessionDateFrom, sessionDateTo);

        // ============================================================
        // STEP 1: Build filter WITHOUT pagination to get ALL sessions
        // ============================================================
        CourseSessionSearchFilter allFilter = CourseSessionSearchFilter.builder()
                .quickSearch(quickSearch)
                .courseId(courseId)
                .employeeId(trainerId)
                .sessionDay(sessionDay)
                .placeId(placeId)
                .status(status != null ? status.getId() : null)
                .sessionDateFrom(sessionDateFrom)
                .sessionDateTo(sessionDateTo)
                .startTimeFrom(startTimeFrom != null ? LocalTime.parse(startTimeFrom) : null)
                .startTimeTo(startTimeTo != null ? LocalTime.parse(startTimeTo) : null)
                .endTimeFrom(endTimeFrom != null ? LocalTime.parse(endTimeFrom) : null)
                .endTimeTo(endTimeTo != null ? LocalTime.parse(endTimeTo) : null)
                .pagination(PaginationInfo.noPagination())  // NO PAGINATION - get ALL
                .defaultSorting(new SortingInfo<>(CourseSessionSearchFilter.OrderByAttributes.SESSION_DATE, OrderDirections.DESC))
                .build();

        // ============================================================
        // STEP 2: Get ALL sessions matching the filters
        // ============================================================
        List<CourseSession> allSessions = courseSessionRepository.selectAllByFilters(allFilter);

        // ============================================================
        // STEP 3: Group ALL sessions by courseId + sessionDay + startTime
        // ============================================================
        Map<String, List<CourseSession>> groupedMap = allSessions.stream()
                .collect(Collectors.groupingBy(session ->
                        session.getCourse().getId() + "|" +
                                session.getSessionDay() + "|" +
                                session.getStartTime().toString()
                ));

        // ============================================================
        // STEP 4: Build grouped items with ALL trainers
        // ============================================================
        List<CourseSessionVTO> allGroupedItems = new ArrayList<>();

        for (Map.Entry<String, List<CourseSession>> entry : groupedMap.entrySet()) {
            List<CourseSession> sessionGroup = entry.getValue();
            CourseSession firstSession = sessionGroup.get(0);

            // Collect ALL trainers from ALL sessions in this group
            List<Employee> trainersForSlot = sessionGroup.stream()
                    .map(CourseSession::getTrainer)
                    .filter(Objects::nonNull)
                    .distinct()
                    .collect(Collectors.toList());

            CourseSessionVTO vto = employeeMapper.toCourseSessionVTO(firstSession);
            vto.setTrainers(employeeMapper.toLookupVTOs(trainersForSlot));
            allGroupedItems.add(vto);
        }

        // ============================================================
        // STEP 5: Sort grouped items
        // ============================================================
        // Define day order
        Map<String, Integer> dayOrder = Map.of(
                "SUNDAY", 0, "MONDAY", 1, "TUESDAY", 2,
                "WEDNESDAY", 3, "THURSDAY", 4, "FRIDAY", 5, "SATURDAY", 6
        );

        allGroupedItems.sort((a, b) -> {
            // Sort by course name first
            String courseA = a.getCourse() != null ? a.getCourse().getTitle() : "";
            String courseB = b.getCourse() != null ? b.getCourse().getTitle() : "";
            int courseCompare = courseA.compareTo(courseB);
            if (courseCompare != 0) return courseCompare;

            // Then by day order
            int dayA = dayOrder.getOrDefault(a.getSessionDay(), 99);
            int dayB = dayOrder.getOrDefault(b.getSessionDay(), 99);
            if (dayA != dayB) return dayA - dayB;

            // Then by start time
            return a.getStartTime().compareTo(b.getStartTime());
        });

        // ============================================================
        // STEP 6: Apply pagination to the grouped results
        // ============================================================
        int totalGroups = allGroupedItems.size();
        int start = pageNum * pageSize;
        int end = Math.min(start + pageSize, totalGroups);

        // Handle case where start > totalGroups
        if (start >= totalGroups) {
            return CourseSessionResultSet.builder()
                    .items(Collections.emptyList())
                    .total(totalGroups)
                    .build();
        }

        List<CourseSessionVTO> paginatedItems = allGroupedItems.subList(start, end);

        return CourseSessionResultSet.builder()
                .items(paginatedItems)
                .total(totalGroups)  // Total is the number of GROUPS
                .build();
    }
}