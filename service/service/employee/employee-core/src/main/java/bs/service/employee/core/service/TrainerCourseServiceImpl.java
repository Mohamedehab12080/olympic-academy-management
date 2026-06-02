package bs.service.employee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
import bs.service.course.model.entity.Course;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.employee.api.repository.TrainerCourseRepository;
import bs.service.employee.api.service.TrainerCourseService;
import bs.service.employee.core.mapper.EmployeeMapper;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.entity.TrainerCourse;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.filter.TrainerCourseSearchFilter;
import bs.service.employee.model.generated.TrainerCourseAssignmentResultSet;
import bs.service.employee.model.generated.TrainerCourseResultSet;
import bs.service.employee.model.generated.TrainerCourseVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.course.model.enums.CourseErrors.COURSE_NOT_FOUND;
import static bs.service.employee.model.enums.EmployeeErrors.*;

@Service
@AllArgsConstructor
public class TrainerCourseServiceImpl implements TrainerCourseService {

    private final TrainerCourseRepository trainerCourseRepository;
    private final EmployeeRepository employeeRepository;
    private final CourseRepository courseRepository;
    private final EmployeeMapper employeeMapper;

    @Override
    @Transactional
    public NewRecordVTO assignCourseToTrainer(Integer trainerId, Integer courseId) {
        // Verify trainer exists and is actually a trainer
        Employee trainer = employeeRepository.selectById(trainerId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

        if (trainer.getEmployeeType() != EmployeeTypes.TRAINER) {
            throw new BusinessException(INVALID_EMPLOYEE_TYPE, "Employee is not a trainer");
        }

        // Verify course exists
        courseRepository.selectById(courseId)
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND, courseId));

        TrainerCourseSearchFilter trainerCourseSearchFilter=TrainerCourseSearchFilter.builder()
                .trainerId(trainerId)
                .courseId(courseId)
                .pagination(PaginationInfo.noPagination())
                .build();
        TrainerCourse trainerCourse=trainerCourseRepository.selectAllByFilters(trainerCourseSearchFilter).stream().findFirst().orElseThrow(()-> new BusinessException(COURSE_ALREADY_ASSIGNED_TO_TRAINER, trainerId, courseId));


        TrainerCourse assignment = TrainerCourse.builder()
                .employee(trainer)
                .course(Course.builder().id(courseId).build())
                .build();

        assignment = trainerCourseRepository.insert(assignment);
        return NewRecordVTO.builder().id(assignment.getId()).build();
    }

    @Override
    @Transactional
    public void unassignCourseFromTrainer(Integer trainerId, Integer courseId) {
        TrainerCourseSearchFilter trainerCourseSearchFilter=TrainerCourseSearchFilter.builder()
                .trainerId(trainerId)
                .courseId(courseId)
                .pagination(PaginationInfo.noPagination())
                .build();
        TrainerCourse assignment=trainerCourseRepository.selectAllByFilters(trainerCourseSearchFilter).stream().findFirst().orElseThrow(()-> new BusinessException(COURSE_ALREADY_ASSIGNED_TO_TRAINER, trainerId, courseId));
        trainerCourseRepository.delete(assignment);
    }

    @Override
    public TrainerCourseResultSet getTrainerCoursesByFilter(Integer trainerId, Integer pageNum, Integer pageSize,
                                                    OrderDirections orderDir, String orderBy) {
        // Verify trainer exists
        employeeRepository.selectById(trainerId)
                .orElseThrow(() -> new BusinessException(EMPLOYEE_NOT_FOUND, trainerId));

        TrainerCourseSearchFilter filter = TrainerCourseSearchFilter.builder()
                .trainerId(trainerId)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TrainerCourseSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<TrainerCourse> assignments = trainerCourseRepository.selectAllByFilters(filter);
        List<TrainerCourseVTO> items = employeeMapper.toTrainerCourseVTOs(assignments);

        return TrainerCourseResultSet.builder()
                .items(items)
                .total(trainerCourseRepository.countAllByFilters(filter))
                .build();
    }

    @Override
    public TrainerCourseAssignmentResultSet getAllTrainerCourseAssignmentsByFilter(Integer trainerId, Integer courseId,
                                                                           Integer pageNum, Integer pageSize,
                                                                           OrderDirections orderDir, String orderBy) {
        TrainerCourseSearchFilter filter = TrainerCourseSearchFilter.builder()
                .trainerId(trainerId)
                .courseId(courseId)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TrainerCourseSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<TrainerCourse> assignments = trainerCourseRepository.selectAllByFilters(filter);
        var items = employeeMapper.toTrainerCourseAssignmentVTOs(assignments);

        return TrainerCourseAssignmentResultSet.builder()
                .items(items)
                .total(trainerCourseRepository.countAllByFilters(filter))
                .build();
    }
}