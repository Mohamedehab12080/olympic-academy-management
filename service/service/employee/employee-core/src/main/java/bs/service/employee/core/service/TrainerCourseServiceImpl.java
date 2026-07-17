package bs.service.employee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
import bs.service.course.model.entity.Course;
import bs.service.course.model.filter.CourseSearchFilter;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.repository.TrainerCourseRepository;
import bs.service.employee.api.service.TrainerCourseService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.TrainerCourse;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;
import bs.service.employee.model.generated.AssignCourseDTO;
import bs.service.employee.model.generated.TrainerCourseAssignmentResultSet;
import bs.service.employee.model.generated.TrainerCourseResultSet;
import bs.service.employee.model.generated.TrainerCourseVTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.course.model.enums.CourseErrors.COURSE_NOT_FOUND;
import static bs.service.employee.model.enums.EmployeeErrors.*;

@Slf4j
@Service
@AllArgsConstructor
public class    TrainerCourseServiceImpl implements TrainerCourseService {

    private final TrainerCourseRepository trainerCourseRepository;
    private final EmployeeRepository employeeRepository;
    private final CourseRepository courseRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public NewRecordVTO assignCourseToTrainer(Integer trainerId, AssignCourseDTO assignCourseDTO) {
        log.info("COURSES TO ADD : {} ",assignCourseDTO.getCourseIdToBeAdded());
        // Verify trainer exists and is actually a trainer
        Employee trainer = employeeRepository.selectById(trainerId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

        CourseSearchFilter courseSearchFilter=CourseSearchFilter.builder()
                        .courseIds(assignCourseDTO.getCourseIdToBeAdded())
                                .pagination(PaginationInfo.noPagination())
                .build();
        List<Course> coursesToBeAdded=courseRepository.selectAllByFilter(courseSearchFilter);
        if(coursesToBeAdded!=null && coursesToBeAdded.isEmpty()){
            throw new BusinessException(COURSE_NOT_FOUND,assignCourseDTO.getCourseIdToBeAdded());
        }

        TrainerCourseSearchFilter trainerCourseSearchFilter=TrainerCourseSearchFilter.builder()
                .trainerId(trainerId)
                .courseIds(assignCourseDTO.getCourseIdToBeAdded())
                .pagination(PaginationInfo.noPagination())
                .build();

        List<TrainerCourse> trainerCourses=trainerCourseRepository.selectAllByFilters(trainerCourseSearchFilter);
        if(trainerCourses!=null && !trainerCourses.isEmpty()){
            throw new BusinessException(COURSE_ALREADY_ASSIGNED_TO_TRAINER, trainerId, assignCourseDTO.getCourseIdToBeAdded());
        }

        assert coursesToBeAdded != null;
        for (Course course : coursesToBeAdded) {
            TrainerCourse assignment = TrainerCourse.builder()
                    .trainer(trainer)
                    .course(course)
                    .build();
            trainerCourseRepository.insert(assignment);
        }

        CourseSearchFilter courseSearchFilter2=CourseSearchFilter.builder()
                .courseIds(assignCourseDTO.getCourseIdToBeDeleted())
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Course> coursesToBeDeleted=courseRepository.selectAllByFilter(courseSearchFilter2);
        if(coursesToBeDeleted!=null && coursesToBeDeleted.isEmpty()){
            throw new BusinessException(COURSE_NOT_FOUND,assignCourseDTO.getCourseIdToBeAdded());
        }
            if(assignCourseDTO.getCourseIdToBeDeleted()!=null && !assignCourseDTO.getCourseIdToBeDeleted().isEmpty()){

                TrainerCourseSearchFilter trainerCourseSearchFilter2=TrainerCourseSearchFilter.builder()
                        .trainerId(trainerId)
                        .courseIds(assignCourseDTO.getCourseIdToBeDeleted())
                        .pagination(PaginationInfo.noPagination())
                        .build();
                List<TrainerCourse> trainerCoursesToBeDeleted=trainerCourseRepository.selectAllByFilters(trainerCourseSearchFilter2);
                if(trainerCoursesToBeDeleted!=null && trainerCoursesToBeDeleted.isEmpty()){
                    throw new BusinessException(TRAINER_COURSE_ASSIGNMENT_NOT_FOUND, trainerId, assignCourseDTO.getCourseIdToBeDeleted());
                }

                assert trainerCoursesToBeDeleted != null;
                for (TrainerCourse trainerCourse:trainerCoursesToBeDeleted){
                    trainerCourseRepository.delete(trainerCourse);
                }

            }
        return NewRecordVTO.builder().id(1).build();
    }

    @Override
    @Transactional
    public void unassignCourseFromTrainer(Integer trainerCourseId) {
        TrainerCourse trainerCourse=trainerCourseRepository.selectById(trainerCourseId).orElseThrow(()-> new BusinessException(COURSE_NOT_FOUND, trainerCourseId));
        trainerCourseRepository.delete(trainerCourse);
    }

    @Override
    public TrainerCourseResultSet getTrainerCoursesByFilter(String quickSearch,Integer trainerId, Integer courseId,
                                                            Integer pageNum, Integer pageSize,
                                                            OrderDirections orderDir, String orderBy) {
        // Verify trainer exists
        if(trainerId!=null){
            employeeRepository.selectById(trainerId)
                    .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

        }
        if(courseId!=null){
            courseRepository.selectById(courseId).orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND, courseId));
        }

        TrainerCourseSearchFilter filter = TrainerCourseSearchFilter.builder()
                .quickSearch(quickSearch)
                .trainerId(trainerId)
                .courseId(courseId)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TrainerCourseSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<TrainerCourse> assignments = trainerCourseRepository.selectAllByFilters(filter);
        var items = employeeMapper.toTrainerCourseVTOs(assignments);

        return TrainerCourseResultSet.builder()
                .items(items)
                .total(trainerCourseRepository.countAllByFilters(filter))
                .build();
    }

}