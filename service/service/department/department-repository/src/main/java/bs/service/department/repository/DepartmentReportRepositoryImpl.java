package bs.service.department.repository;

import bs.service.department.api.repository.DepartmentReportRepository;
import bs.service.department.model.generated.DepartmentVTO;
import bs.service.user.model.generated.LightUserVTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Repository
@AllArgsConstructor
public class DepartmentReportRepositoryImpl implements DepartmentReportRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public DepartmentVTO getDepartmentReport(Integer departmentId, LocalDate fromDate, LocalDate toDate) {
        if (departmentId == null) {
            throw new IllegalArgumentException("Department ID cannot be null");
        }

        // Convert dates to LocalDateTime for query
        LocalDateTime fromDateTime = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime toDateTime = toDate != null ? toDate.atTime(LocalTime.MAX) : null;

        log.info("Calculating department report for departmentId: {}, from: {}, to: {}",
                departmentId, fromDateTime, toDateTime);

        try {
            // First, get the department details
            DepartmentVTO departmentVTO = getDepartmentDetails(departmentId);

            // Then, calculate the report metrics
            Map<String, Object> metrics = executeDepartmentReportQuery(departmentId, fromDateTime, toDateTime);

            // Set the metrics
            departmentVTO.setTotalCourses(getIntValue(metrics, "totalCourses"));
            departmentVTO.setTotalGained(getIntValue(metrics, "totalGained"));
            departmentVTO.setTotalEnrollmentPayments(getIntValue(metrics, "totalEnrollmentPayments"));
            departmentVTO.setTotalStudents(getIntValue(metrics, "totalStudents"));

            log.info("Department report calculated: departmentId={}, totalCourses={}, totalGained={}, totalStudents={}",
                    departmentId, departmentVTO.getTotalCourses(), departmentVTO.getTotalGained(),
                    departmentVTO.getTotalStudents());

            return departmentVTO;

        } catch (Exception e) {
            log.error("Error calculating department report for departmentId: {}, from: {}, to: {}",
                    departmentId, fromDateTime, toDateTime, e);
            throw new RuntimeException("Failed to calculate department report", e);
        }
    }

    /**
     * Get department details using JPA instead of native query
     */
    private DepartmentVTO getDepartmentDetails(Integer departmentId) {
        // Using JPA query to get proper types
        String jpql = """
            SELECT 
                d.id,
                d.title,
                d.description,
                d.isActive,
                d.createdOn,
                d.lastModifiedOn,
                u1.id,
                u1.fullName,
                u2.id,
                u2.fullName
            FROM Department d
            LEFT JOIN d.createdBy u1
            LEFT JOIN d.lastModifiedBy u2
            WHERE d.id = :departmentId AND d.isDeleted = false
            """;

        TypedQuery<Object[]> query = entityManager.createQuery(jpql, Object[].class);
        query.setParameter("departmentId", departmentId);

        Object[] result = query.getSingleResult();

        DepartmentVTO departmentVTO = DepartmentVTO.builder()
                .id(((Number) result[0]).intValue())
                .title((String) result[1])
                .description((String) result[2])
                .isActive((Boolean) result[3])
                .createdOn((LocalDateTime) result[4]) // This will be LocalDateTime
                .lastModifiedOn((LocalDateTime) result[5]) // This will be LocalDateTime
                .build();

        // Set createdBy
        if (result[6] != null && result[7] != null) {
            LightUserVTO createdBy = LightUserVTO.builder()
                    .id(((Number) result[6]).intValue())
                    .fullName((String) result[7])
                    .build();
            departmentVTO.setCreatedBy(createdBy);
        }

        // Set lastModifiedBy
        if (result[8] != null && result[9] != null) {
            LightUserVTO lastModifiedBy = LightUserVTO.builder()
                    .id(((Number) result[8]).intValue())
                    .fullName((String) result[9])
                    .build();
            departmentVTO.setLastModifiedBy(lastModifiedBy);
        }

        return departmentVTO;
    }

    /**
     * Execute the department report query with date range filters
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> executeDepartmentReportQuery(Integer departmentId,
                                                             LocalDateTime fromDateTime,
                                                             LocalDateTime toDateTime) {

        // Build dynamic SQL with date filters
        String sql = buildDynamicQuery(fromDateTime, toDateTime);

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("departmentId", departmentId);

        // Set date parameters only if they are provided
        if (fromDateTime != null) {
            query.setParameter("fromDate", fromDateTime);
        }
        if (toDateTime != null) {
            query.setParameter("toDate", toDateTime);
        }

        Object[] result = (Object[]) query.getSingleResult();

        Map<String, Object> results = new HashMap<>();
        results.put("totalCourses", result[0] != null ? ((Number) result[0]).intValue() : 0);
        results.put("totalGained", result[1] != null ? ((Number) result[1]).intValue() : 0);
        results.put("totalEnrollmentPayments", result[2] != null ? ((Number) result[2]).intValue() : 0);
        results.put("totalStudents", result[3] != null ? ((Number) result[3]).intValue() : 0);

        return results;
    }

    /**
     * Build dynamic SQL query based on provided date filters
     */
    private String buildDynamicQuery(LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        StringBuilder sql = new StringBuilder();

        sql.append("SELECT ");

        // ================================================================
        // 1. Total Courses in this department
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT COUNT(DISTINCT c.id) ");
        sql.append("        FROM oa_course c ");
        sql.append("        WHERE c.department_id = :departmentId ");
        sql.append("          AND c.is_deleted = 0 ");
        sql.append("          AND c.is_active = 1 ");

        if (fromDateTime != null) {
            sql.append("          AND c.created_on >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND c.created_on <= :toDate ");
        }

        sql.append("    ), 0) AS total_courses, ");

        // ================================================================
        // 2. Total Gained: SUM of enrollment payments for courses in this department
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT SUM(ep.paid_amount) ");
        sql.append("        FROM oa_enrollment_payment ep ");
        sql.append("        INNER JOIN oa_enrollment enr ON enr.id = ep.enrollment_id ");
        sql.append("        INNER JOIN oa_course c ON c.id = enr.course_id ");
        sql.append("        WHERE c.department_id = :departmentId ");
        sql.append("          AND c.is_deleted = 0 ");
        sql.append("          AND enr.is_deleted = 0 ");
        sql.append("          AND enr.enrollment_status != 3 "); // Not Cancelled
        sql.append("          AND enr.payment_status NOT IN (3, 4, 5) "); // Not FAILED, CANCELLED, or REFUNDED
        sql.append("          AND ep.is_deleted = 0 ");
        sql.append("          AND ep.payment_status IN (2, 6) "); // Completed or Partial

        if (fromDateTime != null) {
            sql.append("          AND ep.payment_date >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND ep.payment_date <= :toDate ");
        }

        sql.append("    ), 0) AS total_gained, ");

        // ================================================================
        // 3. Total Enrollment Payments count
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT COUNT(DISTINCT ep.id) ");
        sql.append("        FROM oa_enrollment_payment ep ");
        sql.append("        INNER JOIN oa_enrollment enr ON enr.id = ep.enrollment_id ");
        sql.append("        INNER JOIN oa_course c ON c.id = enr.course_id ");
        sql.append("        WHERE c.department_id = :departmentId ");
        sql.append("          AND c.is_deleted = 0 ");
        sql.append("          AND enr.is_deleted = 0 ");
        sql.append("          AND enr.enrollment_status != 3 ");
        sql.append("          AND enr.payment_status NOT IN (3, 4, 5) ");
        sql.append("          AND ep.is_deleted = 0 ");
        sql.append("          AND ep.payment_status IN (2, 6) ");

        if (fromDateTime != null) {
            sql.append("          AND ep.payment_date >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND ep.payment_date <= :toDate ");
        }

        sql.append("    ), 0) AS total_enrollment_payments, ");

        // ================================================================
        // 4. Total Students (unique trainees enrolled in department courses)
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT COUNT(DISTINCT enr.trainee_id) ");
        sql.append("        FROM oa_enrollment enr ");
        sql.append("        INNER JOIN oa_course c ON c.id = enr.course_id ");
        sql.append("        WHERE c.department_id = :departmentId ");
        sql.append("          AND c.is_deleted = 0 ");
        sql.append("          AND enr.is_deleted = 0 ");
        sql.append("          AND enr.enrollment_status != 3 "); // Not Cancelled
        sql.append("          AND enr.payment_status NOT IN (3, 4, 5) ");

        if (fromDateTime != null) {
            sql.append("          AND enr.created_on >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND enr.created_on <= :toDate ");
        }

        sql.append("    ), 0) AS total_students ");

        return sql.toString();
    }

    /**
     * Safely get integer value from results map
     */
    private int getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? ((Number) value).intValue() : 0;
    }
}