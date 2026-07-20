package bs.service.course.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
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
import bs.service.course.model.generated.CoursePatchDTO;
import bs.service.course.model.generated.CourseResultSet;
import bs.service.course.model.generated.CourseVTO;
import bs.service.department.model.generated.DepartmentVTO;
import bs.service.department.proxy.service.DepartmentMgtProxyService;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.service.enrollment.proxy.service.EnrollmentMgtProxyService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static bs.service.course.model.enums.CourseErrors.COURSE_NOT_FOUND;

@Service
@AllArgsConstructor
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final DepartmentMgtProxyService departmentMgtProxyService;
    private final EnrollmentMgtProxyService enrollmentMgtProxyService;

    @Override
    @Transactional
    public NewRecordVTO createCourse(CourseDTO courseDTO) {
        departmentMgtProxyService.existsById(courseDTO.getDepartmentId());
        Course course =courseMapper.toCourse(courseDTO);
        course=courseRepository.insert(course);
        return NewRecordVTO.builder().id(course.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateCourse(Integer courseId, CourseDTO courseDTO) {
        Course course =courseRepository.selectById(courseId).orElseThrow(()-> new BusinessException(COURSE_NOT_FOUND,courseId));
        Course courseToUpdate=courseMapper.toCourse(courseDTO);
        courseToUpdate.setId(courseId);
        courseToUpdate.setIsDeleted(false);
        courseToUpdate.setIsActive(course.getIsActive());
        courseToUpdate.setCreatedOn(course.getCreatedOn());
        courseToUpdate.setCreatedBy(course.getCreatedBy());
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
        EnrollmentSearchFilter enrollmentSearchFilter=EnrollmentSearchFilter.builder().courseId(courseId).isActive(true).isDeleted(false).pagination(PaginationInfo.noPagination()).build();
        List<EnrollmentVTO> enrollmentVTOS=enrollmentMgtProxyService.getEnrollmentVTOs(enrollmentSearchFilter);
        Integer totalRevenue = enrollmentVTOS.stream()
                .mapToInt(en -> en.getFinalSubscriptionValue() - en.getRemainedSubscriptionValue())
                .sum();
        courseVTO.setTotalRevenue(totalRevenue);
        courseVTO.setEnrollmentsCount(enrollmentVTOS.size());
        return courseVTO;
    }

    @Override
    public CourseResultSet getAllCourses(String quickSearch, Boolean isActive,Boolean isPublic, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy, CourseTypes courseType, LocalDate startDateFrom, LocalDate startDateTo, LocalDate endDateFrom, LocalDate endDateTo) {

        CourseSearchFilter courseSearchFilter = CourseSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .isActive(isActive)
                .isPublic(isPublic)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(CourseSearchFilter.OrderByAttributes.START_DATE,OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .courseType(courseType!=null ?courseType.getId() :null)
                .startDateFrom(startDateFrom)
                .startDateTo(startDateTo)
                .endDateFrom(endDateFrom)
                .endDateTo(endDateTo)
                .build();
        List<Course> courses=courseRepository.selectAllByFilter(courseSearchFilter);
        List<Integer> courseIds = courses.stream().map(Course::getId).toList();
        EnrollmentSearchFilter enrollmentSearchFilter = EnrollmentSearchFilter.builder()
                .courseIds(courseIds)
                .isDeleted(false)
                .isActive(true)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<EnrollmentVTO> enrollmentVTOS = enrollmentMgtProxyService.getEnrollmentVTOs(enrollmentSearchFilter);

        // Group enrollments by course ID
        Map<Integer, List<EnrollmentVTO>> enrollmentsByCourseId = enrollmentVTOS.stream()
                .collect(Collectors.groupingBy(enr-> enr.getCourse().getId(), Collectors.toList()));

        //Map courses to CourseVTOs with calculated values
        List<CourseVTO> courseVTOS = courses.stream()
                .map(course -> {
                    CourseVTO courseVTO = courseMapper.toCourseVTO(course);

                    // Get enrollments for this specific course
                    List<EnrollmentVTO> courseEnrollments = enrollmentsByCourseId.getOrDefault(course.getId(), Collections.emptyList());

                    // Calculate total revenue for this course
                    Integer totalRevenue = courseEnrollments.stream()
                            .mapToInt(en -> en.getFinalSubscriptionValue() - en.getRemainedSubscriptionValue())
                            .sum();

                    // Set values
                    courseVTO.setTotalRevenue(totalRevenue);
                    courseVTO.setEnrollmentsCount(courseEnrollments.size());

                    return courseVTO;
                })
                .collect(Collectors.toList());

        return CourseResultSet.builder().items(courseVTOS).total(courseVTOS.size()).build();
    }

    @Override
    public LookupResultSet getAllCoursesLookup() {
        CourseSearchFilter courseSearchFilter=CourseSearchFilter.builder()
                .isActive(true)
                .isDeleted(false)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Course> courses=courseRepository.selectAllByFilter(courseSearchFilter);
        List<LookupVTO> lookupVTOS=courseMapper.toLookupVTOs(courses);
        return LookupResultSet.builder()._list(lookupVTOS).total(lookupVTOS.size()).build();
    }

    @Override
    public LookupResultSet getAllCoursesTypesLookup() {
        System.out.println("Courses Types : "+ Arrays.toString(CourseTypes.values()));
        List<LookupVTO> lookupVTOS=courseMapper.toLookupCourseTypeVTOs(List.of(CourseTypes.values()));
        LookupResultSet lookupResultSet=LookupResultSet.builder()._list(lookupVTOS).total(lookupVTOS.size()).build();
        System.out.println(lookupResultSet);
        return lookupResultSet;
    }

    @Override
    @Transactional
    public void patchUpdateCourse(CoursePatchDTO coursePatchDTO) {
        CourseSearchFilter courseSearchFilter=CourseSearchFilter.builder()
                .courseIds(coursePatchDTO.getCourseIds())
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Course> courses=courseRepository.selectAllByFilter(courseSearchFilter);
        if(courses.size()!=coursePatchDTO.getCourseIds().size()){
            throw new BusinessException(COURSE_NOT_FOUND, coursePatchDTO.getCourseIds());
        }
        for (Course course : courses) {
            course.setIsActive(coursePatchDTO.getIsActive()!=null?coursePatchDTO.getIsActive():course.getIsActive());
            course.setIsPublic(coursePatchDTO.getIsPublic()!=null?coursePatchDTO.getIsPublic():course.getIsPublic());
            course.setDuration(coursePatchDTO.getDuration()!=null?coursePatchDTO.getDuration():course.getDuration());
            course.setStartDate(coursePatchDTO.getStartDate()!=null?coursePatchDTO.getStartDate():course.getStartDate());
            course.setEndDate(coursePatchDTO.getEndDate()!=null?coursePatchDTO.getEndDate():course.getEndDate());
            course.setMaxCapacity(coursePatchDTO.getMaxCapacity()!=null?coursePatchDTO.getMaxCapacity():course.getMaxCapacity());
            course.setCreatedBy(course.getCreatedBy());
            course.setCreatedOn(course.getCreatedOn());
            courseRepository.update(course);
        }
    }
}
