package bs.service.enrollment.api.repository;

import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.filter.EnrollmentTypeSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EnrollmentTypeRepository {
    EnrollmentType insert(EnrollmentType enrollmentType);
    EnrollmentType update(EnrollmentType enrollmentType);
    Optional<EnrollmentType> selectById(Integer id);
    List<EnrollmentType> selectAllByFilters(EnrollmentTypeSearchFilter filters);
    Integer countAllByFilters(EnrollmentTypeSearchFilter filters);
}