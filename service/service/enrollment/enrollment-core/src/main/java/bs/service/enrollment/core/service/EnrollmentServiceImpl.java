package bs.service.enrollment.core.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.course.api.repository.CourseRepository;
import bs.service.employee.api.repository.EmployeeRepository;
import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.api.service.EnrollmentService;
import bs.service.enrollment.core.mapper.EnrollmentMapper;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.enrollment.model.generated.EnrollmentDTO;
import bs.service.enrollment.model.generated.EnrollmentListItem;
import bs.service.enrollment.model.generated.EnrollmentResultSet;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.service.trainee.api.repository.TraineeRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.enrollment.model.enums.EnrollmentErrors.*;

@Service
@AllArgsConstructor
public class EnrollmentServiceImpl implements EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final TraineeRepository traineeRepository;
    private final CourseRepository courseRepository;
    private final EmployeeRepository employeeRepository;
    private final EnrollmentMapper enrollmentMapper;

    @Override
    @Transactional
    public NewRecordVTO createEnrollment(EnrollmentDTO enrollmentDTO) {
        // Validate trainee exists
        traineeRepository.selectById(enrollmentDTO.getTraineeId())
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND_FOR_ENROLLMENT, enrollmentDTO.getTraineeId()));

        // Validate course exists
        courseRepository.selectById(enrollmentDTO.getCourseId())
                .orElseThrow(() -> new BusinessException(COURSE_NOT_FOUND_FOR_ENROLLMENT, enrollmentDTO.getCourseId()));

        // Validate trainer exists
        employeeRepository.selectById(enrollmentDTO.getTrainerId())
                .orElseThrow(() -> new BusinessException(TRAINER_NOT_FOUND_FOR_ENROLLMENT, enrollmentDTO.getTrainerId()));

        Enrollment enrollment = enrollmentMapper.toEnrollment(enrollmentDTO);
        enrollment = enrollmentRepository.insert(enrollment);
        return NewRecordVTO.builder().id(enrollment.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEnrollment(Integer enrollmentId, EnrollmentDTO enrollmentDTO) {
        Enrollment enrollment = enrollmentRepository.selectById(enrollmentId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_NOT_FOUND, enrollmentId));

        Enrollment enrollmentToUpdate = enrollmentMapper.toEnrollment(enrollmentDTO);
        enrollmentToUpdate.setId(enrollmentId);
        enrollmentRepository.update(enrollmentToUpdate);
        return NewRecordVTO.builder().id(enrollmentId).build();
    }

    @Override
    @Transactional
    public void deleteEnrollment(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.selectById(enrollmentId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_NOT_FOUND, enrollmentId));
        enrollment.setIsDeleted(true);
        enrollmentRepository.update(enrollment);
    }

    @Override
    public EnrollmentVTO getEnrollmentById(Integer enrollmentId) {
        Enrollment enrollment = enrollmentRepository.selectById(enrollmentId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_NOT_FOUND, enrollmentId));
        return enrollmentMapper.toEnrollmentVTO(enrollment);
    }

    @Override
    public EnrollmentResultSet getAllEnrollmentsByFilter(String quickSearch, Boolean isActive,
                                                         Integer traineeId, Integer courseId, Integer trainerId,
                                                         Integer enrollmentTypeId, EnrollmentStatus enrollmentStatus,
                                                         PaymentStatus paymentStatus, LocalDate startDateFrom,
                                                         LocalDate startDateTo, LocalDate endDateFrom,
                                                         LocalDate endDateTo, LocalDate createdOnFrom,
                                                         LocalDate createdOnTo, Integer pageNum, Integer pageSize,
                                                         OrderDirections orderDir, String orderBy) {
        EnrollmentSearchFilter filter = EnrollmentSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .isActive(isActive)
                .traineeId(traineeId)
                .courseId(courseId)
                .trainerId(trainerId)
                .enrollmentTypeId(enrollmentTypeId)
                .enrollmentStatus(enrollmentStatus!=null?enrollmentStatus.id:null)
                .paymentStatus(paymentStatus!=null ? paymentStatus.id:null)
                .startDateFrom(startDateFrom)
                .startDateTo(startDateTo)
                .endDateFrom(endDateFrom)
                .endDateTo(endDateTo)
                .createdOnFrom(createdOnFrom)
                .createdOnTo(createdOnTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EnrollmentSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<Enrollment> enrollments = enrollmentRepository.selectAllByFilters(filter);
        List<EnrollmentListItem> items = enrollmentMapper.toEnrollmentListItems(enrollments);

        return EnrollmentResultSet.builder()
                .items(items)
                .total(items.size())
                .build();
    }
}