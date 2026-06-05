package bs.service.employee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
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
import java.util.List;

import static bs.service.employee.model.enums.EmployeeErrors.*;

@Service
@AllArgsConstructor
public class CourseSessionServiceImpl implements CourseSessionService {

    private final CourseSessionRepository courseSessionRepository;
    private final CourseRepository courseRepository;
    private final EmployeeRepository employeeRepository;
    private final PlaceRepository placeRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public NewRecordVTO createCourseSession(Integer courseId, CourseSessionDTO courseSessionDTO) {
        // Validate course exists
        courseRepository.selectById(courseId)
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, courseId));

        // Validate employee exists and is a trainer
        Employee employee = employeeRepository.selectById(courseSessionDTO.getTrainerId())
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, courseSessionDTO.getTrainerId()));

        if (employee.getEmployeeType() != EmployeeTypes.TRAINER) {
            throw new BusinessException(INVALID_EMPLOYEE_TYPE, "Only trainers can be assigned to course sessions");
        }

        // Validate place exists
        placeRepository.selectById(courseSessionDTO.getPlaceId())
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND_FOR_SESSION, courseSessionDTO.getPlaceId()));

        // Validate start time before end time
        LocalTime startTime = LocalTime.parse(courseSessionDTO.getStartTime());
        LocalTime endTime = LocalTime.parse(courseSessionDTO.getEndTime());
        if (startTime.isAfter(endTime)) {
            throw new BusinessException(START_TIME_AFTER_END_TIME);
        }

        CourseSession courseSession = employeeMapper.toCourseSession(courseSessionDTO);
        courseSession.setCourse(bs.service.course.model.entity.Course.builder().id(courseId).build());
        courseSession = courseSessionRepository.insert(courseSession);

        return NewRecordVTO.builder().id(courseSession.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateCourseSession(Integer courseId, Integer sessionId, CourseSessionDTO courseSessionDTO) {
        // Validate course exists
        courseRepository.selectById(courseId)
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_TRAINER, courseId));

        CourseSession courseSession = courseSessionRepository.selectById(sessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, sessionId));

        CourseSession sessionToUpdate = employeeMapper.toCourseSession(courseSessionDTO);
        sessionToUpdate.setId(sessionId);
        sessionToUpdate.setCourse(bs.service.course.model.entity.Course.builder().id(courseId).build());
        courseSessionRepository.update(sessionToUpdate);

        return NewRecordVTO.builder().id(sessionId).build();
    }

    @Override
    @Transactional
    public void deleteCourseSession(Integer courseId, Integer sessionId) {
        CourseSession courseSession = courseSessionRepository.selectById(sessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, sessionId));

        courseSession.setIsDeleted(true);
        courseSessionRepository.update(courseSession);
    }

    @Override
    public CourseSessionVTO getCourseSessionById(Integer courseId, Integer sessionId) {
        CourseSession courseSession = courseSessionRepository.selectById(sessionId)
                .orElseThrow(() -> new BusinessException(COURSE_SESSION_NOT_FOUND, sessionId));
        return employeeMapper.toCourseSessionVTO(courseSession);
    }

    @Override
    public CourseSessionResultSet getAllCourseSessionsByFilter(Integer courseId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .status(status)
                .sessionDateFrom(sessionDateFrom)
                .sessionDateTo(sessionDateTo)
                .startTimeFrom(LocalTime.parse(startTimeFrom))
                .startTimeTo(LocalTime.parse(startTimeTo))
                .endTimeFrom(LocalTime.parse(endTimeFrom))
                .endTimeTo(LocalTime.parse(endTimeTo))
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
    public CourseSessionResultSet getAllSessionsByFilter(Integer courseId, Integer trainerId, Integer placeId, SessionStatus status, LocalDate sessionDateFrom, LocalDate sessionDateTo, String startTimeFrom, String startTimeTo, String endTimeFrom, String endTimeTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        CourseSessionSearchFilter filter = CourseSessionSearchFilter.builder()
                .courseId(courseId)
                .employeeId(trainerId)
                .placeId(placeId)
                .status(status)
                .sessionDateFrom(sessionDateFrom)
                .sessionDateTo(sessionDateTo)
                .startTimeFrom(LocalTime.parse(startTimeFrom))
                .startTimeTo(LocalTime.parse(startTimeTo))
                .endTimeFrom(LocalTime.parse(endTimeFrom))
                .endTimeTo(LocalTime.parse(endTimeTo))
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