package bs.service.enrollment.api.repository;

import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EnrollmentRepository {
    Enrollment insert(Enrollment enrollment);
    Enrollment update(Enrollment enrollment);
    Optional<Enrollment> selectById(Integer id);
    List<Enrollment> selectAllByFilters(EnrollmentSearchFilter filters);
    Integer countAllByFilters(EnrollmentSearchFilter filters);
}