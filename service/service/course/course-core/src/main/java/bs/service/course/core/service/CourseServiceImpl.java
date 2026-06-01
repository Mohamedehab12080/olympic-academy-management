package bs.service.course.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
import bs.service.course.api.service.CourseService;
import bs.service.course.core.mapper.CourseMapper;
import bs.service.course.model.entity.Course;
import bs.service.course.model.enums.CourseTypes;
import bs.service.course.model.filter.CourseSearchFilter;
import bs.service.course.model.generated.CourseDTO;
import bs.service.course.model.generated.CourseResultSet;
import bs.service.course.model.generated.CourseVTO;
import bs.service.department.model.generated.DepartmentVTO;
import bs.service.department.proxy.service.DepartmentMgtProxyService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.course.model.enums.CourseErrors.COURSE_NOT_FOUND;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final DepartmentMgtProxyService departmentMgtProxyService;

    @Override
    @Transactional
    public NewRecordVTO createCourse(CourseDTO courseDTO) {
        DepartmentVTO departmentVTO=departmentMgtProxyService.getDepartmentDetails(courseDTO.getDepartmentId());
        Course course =courseMapper.toCourse(courseDTO);
        course=courseRepository.insert(course);
        return NewRecordVTO.builder().id(course.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateCourse(Integer courseId, CourseDTO courseDTO) {
        Course course =courseRepository.selectById(courseId).orElseThrow(()-> new BusinessException(COURSE_NOT_FOUND,courseId));
        Course courseToUpdate=courseMapper.toCourse(courseDTO);
        courseRepository.update(courseToUpdate);
        return NewRecordVTO.builder().id(courseId).build();
    }

    @Override
    @Transactional
    public void deleteCourseById(Integer courseId) {
        Course course =courseRepository.selectById(courseId).orElseThrow(()-> new BusinessException(COURSE_NOT_FOUND,courseId));
        course.setIsDeleted(true);
        courseRepository.update(course);
    }

    @Override
    public CourseVTO getCourseById(Integer courseId) {
        Course course =courseRepository.selectById(courseId).orElseThrow(()-> new BusinessException(COURSE_NOT_FOUND,courseId));
        CourseVTO courseVTO = courseMapper.toCourseVTO(course);
        return courseVTO;
    }

    @Override
    public CourseResultSet getAllCourses(String quickSearch, Boolean isActive, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy, CourseTypes courseType, LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo) {

        CourseSearchFilter courseSearchFilter = CourseSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .isActive(isActive)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(CourseSearchFilter.OrderByAttributes.START_DATE,OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .courseType(courseType.name())
                .startDateFrom(startDateFrom)
                .startDateTo(startDateTo)
                .endDateFrom(endDateFrom)
                .endDateTo(endDateTo)
                .build();
        List<Course> courses=courseRepository.selectAllByFilter(courseSearchFilter);
        List<CourseVTO> courseVTOS=courseMapper.toCourseVTOs(courses);
        return CourseResultSet.builder().items(courseVTOS).total(courseRepository.countAllByFilter(courseSearchFilter)).build();
    }
}
