package bs.service.financial.repository;

import bs.service.financial.api.repository.MainTotalRepository;
import bs.service.financial.model.generated.FinancialTotalVTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Repository
@AllArgsConstructor
public class MainTotalRepositoryImpl implements MainTotalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public FinancialTotalVTO findMainFinancialTotalVTO(String year) {
        LocalDateTime cutoffDate = getCutoffDateTime(year);

        log.info("Calculating financial totals for period ending: {}", cutoffDate);

        FinancialTotalVTO vto = new FinancialTotalVTO();

        try {
            // Execute optimized single query with subqueries
            Map<String, Object> results = executeAllQueries(cutoffDate);

            // Log the results for debugging
            log.debug("Dashboard results: {}", results);

            vto.setTotalSalary(getIntValue(results, "totalSalary"));
            vto.setTotalAdvance(getIntValue(results, "totalAdvance"));
            vto.setTotalIncentives(getIntValue(results, "totalIncentives"));
            vto.setTotalPlacesRent(getIntValue(results, "totalRent"));
            vto.setTotalEnrollmentPayments(getIntValue(results, "totalEnrollmentPayments"));
            vto.setTotalEnrollmentRefunds(getIntValue(results, "totalEnrollmentRefunds"));
            vto.setTotalExpenses(getIntValue(results, "totalExpenses"));
            vto.setActiveEnrollmentsCount(getIntValue(results, "activeEnrollments"));
            vto.setInactiveEnrollmentsCount(getIntValue(results, "inactiveEnrollments"));
            vto.setActiveCoursesCount(getIntValue(results, "activeCourses"));
            vto.setInactiveCoursesCount(getIntValue(results, "inactiveCourses"));
            vto.setActiveTraineesCount(getIntValue(results, "activeTrainees"));
            vto.setInactiveTraineesCount(getIntValue(results, "inactiveTrainees"));
            vto.setActiveEmployeesCount(getIntValue(results, "activeEmployees"));
            vto.setInactiveEmployeesCount(getIntValue(results, "inactiveEmployees"));

            // At the end of findMainFinancialTotalVTO method, before return:
            log.info("=== DASHBOARD TOTALS ===");
            log.info("Total Salary: {}", vto.getTotalSalary());
            log.info("Total Advances: {}", vto.getTotalAdvance());
            log.info("Total Incentives: {}", vto.getTotalIncentives());
            log.info("Total Rent: {}", vto.getTotalPlacesRent());
            log.info("Total Enrollment Payments: {}", vto.getTotalEnrollmentPayments());
            log.info("Total Enrollment Refunds: {}", vto.getTotalEnrollmentRefunds());
            log.info("Total Expenses: {}", vto.getTotalExpenses());
            log.info("Active Enrollments: {}", vto.getActiveEnrollmentsCount());
            log.info("Inactive Enrollments: {}", vto.getInactiveEnrollmentsCount());
            log.info("Active Courses: {}", vto.getActiveCoursesCount());
            log.info("Inactive Courses: {}", vto.getInactiveCoursesCount());
            log.info("Active Trainees: {}", vto.getActiveTraineesCount());
            log.info("Inactive Trainees: {}", vto.getInactiveTraineesCount());
            log.info("Active Employees: {}", vto.getActiveEmployeesCount());
            log.info("Inactive Employees: {}", vto.getInactiveEmployeesCount());

            log.info("Financial totals calculated successfully: Salary={}, Rent={}, Enrollments={}, Active={}",
                    vto.getTotalSalary(), vto.getTotalPlacesRent(),
                    vto.getTotalEnrollmentPayments(), vto.getActiveEnrollmentsCount());

        } catch (Exception e) {
            log.error("Error calculating financial totals for period: {}", cutoffDate, e);
            throw new RuntimeException("Failed to calculate financial totals", e);
        }

        return vto;
    }

    /**
     * Execute all dashboard queries in a SINGLE SQL statement using subqueries
     * This reduces network round-trips from 15 to 1
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> executeAllQueries(LocalDateTime cutoffDate) {
        String sql = """
            SELECT 
                -- Financial totals using subqueries
                COALESCE((
                    SELECT SUM(amount_withdrawn)
                    FROM oa_salary_incentive
                    WHERE withdraw_date <= :cutoffDate
                      AND salary_transaction_type = 1
                      AND is_deleted = 0
                ), 0) AS total_salary,
                
                COALESCE((
                    SELECT SUM(amount_withdrawn)
                    FROM oa_salary_incentive
                    WHERE withdraw_date <= :cutoffDate
                      AND salary_transaction_type = 4
                      AND is_deleted = 0
                ), 0) AS total_advance,
                
                COALESCE((
                    SELECT SUM(amount_withdrawn)
                    FROM oa_salary_incentive
                    WHERE withdraw_date <= :cutoffDate
                      AND salary_transaction_type IN (2, 3)
                      AND is_deleted = 0
                ), 0) AS total_incentives,
                
                COALESCE((
                    SELECT SUM(payed_amount)
                    FROM oa_place_rent_payment
                    WHERE payment_date <= :cutoffDate
                      AND is_deleted = 0
                ), 0) AS total_rent,
                
                COALESCE((
                    SELECT SUM(ep.paid_amount)
                    FROM oa_enrollment_payment ep
                    INNER JOIN oa_enrollment enr ON ep.enrollment_id = enr.id
                    WHERE ep.payment_date <= :cutoffDate
                      AND ep.is_deleted = 0
                      AND ep.payment_status IN (1, 2, 6)        
                ), 0) AS total_enrollment_payments,
                
                COALESCE((
                    SELECT SUM(er.amount_refunded)
                    FROM oa_enrollment_refund er
                    INNER JOIN oa_enrollment enr ON er.enrollment_id = enr.id
                    WHERE er.refund_date <= :cutoffDate
                      AND er.is_deleted = 0
                      AND er.refund_status IN (2, 4)
                      AND enr.payment_status = 4
                ), 0) AS total_enrollment_refunds,
                
                COALESCE((
                    SELECT SUM(amount_expensed)
                    FROM oa_expense
                    WHERE expense_date <= :cutoffDate
                      AND is_deleted = 0
                ), 0) AS total_expenses,
                
                -- Counts using subqueries
                (SELECT COUNT(*)
                 FROM oa_enrollment
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_enrollments,
                
                (SELECT COUNT(*)
                 FROM oa_enrollment
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0
                   AND enrollment_status != 2) AS inactive_enrollments,
                
                (SELECT COUNT(*)
                 FROM oa_course
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_courses,
                
                (SELECT COUNT(*)
                 FROM oa_course
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0) AS inactive_courses,
                
                (SELECT COUNT(*)
                 FROM oa_trainee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_trainees,
                
                (SELECT COUNT(*)
                 FROM oa_trainee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0) AS inactive_trainees,
                
                (SELECT COUNT(*)
                 FROM oa_employee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_employees,
                
                (SELECT COUNT(*)
                 FROM oa_employee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0) AS inactive_employees
        """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("cutoffDate", cutoffDate);

        Object[] result = (Object[]) query.getSingleResult();

        Map<String, Object> results = new HashMap<>();
        results.put("totalSalary", result[0]);
        results.put("totalAdvance", result[1]);
        results.put("totalIncentives", result[2]);
        results.put("totalRent", result[3]);
        results.put("totalEnrollmentPayments", result[4]);
        results.put("totalEnrollmentRefunds", result[5]);
        results.put("totalExpenses", result[6]);
        results.put("activeEnrollments", result[7]);
        results.put("inactiveEnrollments", result[8]);
        results.put("activeCourses", result[9]);
        results.put("inactiveCourses", result[10]);
        results.put("activeTrainees", result[11]);
        results.put("inactiveTrainees", result[12]);
        results.put("activeEmployees", result[13]);
        results.put("inactiveEmployees", result[14]);

        return results;
    }

    private LocalDateTime getCutoffDateTime(String year) {
        LocalDate date;
        if (year != null && !year.isEmpty()) {
            try {
                int yearInt = Integer.parseInt(year);
                date = LocalDate.of(yearInt, 12, 31);
            } catch (NumberFormatException e) {
                log.warn("Invalid year format: {}, using current date", year);
                date = LocalDate.now();
            }
        } else {
            date = LocalDate.now();
        }
        return date.atStartOfDay();
    }

    private int getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? ((Number) value).intValue() : 0;
    }
}