package bs.service.financial.repository;

import bs.service.financial.api.repository.FinancialTotalRepository;
import bs.service.financial.model.generated.FinancialTotalVTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@Repository
@AllArgsConstructor
public class FinancialTotalRepositoryImpl implements FinancialTotalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public FinancialTotalVTO findFinancialTotalVTO(LocalDate from, LocalDate to) {
        log.info("Calculating financial totals from: {} to: {}", from, to);

        FinancialTotalVTO vto = new FinancialTotalVTO();

        try {
            // Execute optimized single query with subqueries
            Map<String, Object> results = executeAllQueries(from, to);

            // Log results for debugging
            log.debug("Financial report results: {}", results);

            // Set all values from results map
            vto.setTotalSalary(getIntValue(results, "totalSalary"));
            vto.setTotalAdvance(getIntValue(results, "totalAdvance"));
            vto.setTotalIncentives(getIntValue(results, "totalIncentives"));
            vto.setTotalPlacesRent(getIntValue(results, "totalRent"));
            vto.setTotalPlacesGained(getIntValue(results, "totalPlacesGained"));
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

            // Log summary
            log.info("=== FINANCIAL REPORT TOTALS ===");
            log.info("Total Salary: {}", vto.getTotalSalary());
            log.info("Total Advances: {}", vto.getTotalAdvance());
            log.info("Total Incentives: {}", vto.getTotalIncentives());
            log.info("Total Rent (Expense): {}", vto.getTotalPlacesRent());
            log.info("Total Places Gained (Income): {}", vto.getTotalPlacesGained());
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
            log.info("=================================");

        } catch (Exception e) {
            log.error("Error calculating financial totals for period: {} to {}", from, to, e);
            throw new RuntimeException("Failed to calculate financial totals", e);
        }

        return vto;
    }

    /**
     * Execute all financial report queries in a SINGLE SQL statement using subqueries
     * This reduces network round-trips from 16 to 1
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> executeAllQueries(LocalDate from, LocalDate to) {
        // Convert dates to LocalDateTime for comparison
        LocalDateTime fromDateTime = from != null ? from.atStartOfDay() : null;
        LocalDateTime toDateTime = to != null ? to.atTime(LocalTime.MAX) : null;

        String sql = buildDynamicQuery(fromDateTime, toDateTime);

        Query query = entityManager.createNativeQuery(sql);

        // Set parameters only if they are provided
        if (fromDateTime != null) {
            query.setParameter("fromDate", fromDateTime);
        }
        if (toDateTime != null) {
            query.setParameter("toDate", toDateTime);
        }

        Object[] result = (Object[]) query.getSingleResult();

        Map<String, Object> results = new HashMap<>();
        results.put("totalSalary", result[0]);
        results.put("totalAdvance", result[1]);
        results.put("totalIncentives", result[2]);
        results.put("totalRent", result[3]);
        results.put("totalPlacesGained", result[4]);
        results.put("totalEnrollmentPayments", result[5]);
        results.put("totalEnrollmentRefunds", result[6]);
        results.put("totalExpenses", result[7]);
        results.put("activeEnrollments", result[8]);
        results.put("inactiveEnrollments", result[9]);
        results.put("activeCourses", result[10]);
        results.put("inactiveCourses", result[11]);
        results.put("activeTrainees", result[12]);
        results.put("inactiveTrainees", result[13]);
        results.put("activeEmployees", result[14]);
        results.put("inactiveEmployees", result[15]);

        return results;
    }

    /**
     * Build dynamic SQL query with optional date filters
     * Includes totalPlacesGained (rent payments with effect = 1 - مدخل/إيراد)
     */
    private String buildDynamicQuery(LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        StringBuilder sql = new StringBuilder();

        sql.append("SELECT ");

        // 1. Total Salary (transaction_type = 1)
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(amount_withdrawn)");
        sql.append("        FROM oa_salary_incentive");
        sql.append("        WHERE salary_transaction_type = 1");
        sql.append("          AND is_deleted = 0");
        if (fromDateTime != null) {
            sql.append("          AND withdraw_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND withdraw_date <= :toDate");
        }
        sql.append("    ), 0) AS total_salary, ");

        // 2. Total Advances (transaction_type = 4)
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(amount_withdrawn)");
        sql.append("        FROM oa_salary_incentive");
        sql.append("        WHERE salary_transaction_type = 4");
        sql.append("          AND is_deleted = 0");
        if (fromDateTime != null) {
            sql.append("          AND withdraw_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND withdraw_date <= :toDate");
        }
        sql.append("    ), 0) AS total_advance, ");

        // 3. Total Incentives (transaction_type IN (2,3))
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(amount_withdrawn)");
        sql.append("        FROM oa_salary_incentive");
        sql.append("        WHERE salary_transaction_type IN (2, 3)");
        sql.append("          AND is_deleted = 0");
        if (fromDateTime != null) {
            sql.append("          AND withdraw_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND withdraw_date <= :toDate");
        }
        sql.append("    ), 0) AS total_incentives, ");

        // 4. Total Places Rent (effect = 0 - مخرج/مصروف)
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(prp.payed_amount)");
        sql.append("        FROM oa_place_rent_payment prp");
        sql.append("        INNER JOIN oa_rent_type rt ON prp.rent_type_id = rt.id");
        sql.append("        WHERE prp.is_deleted = 0");
        sql.append("          AND rt.effect = 0"); // effect = 0 means مخرج (Expense)
        if (fromDateTime != null) {
            sql.append("          AND prp.payment_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND prp.payment_date <= :toDate");
        }
        sql.append("    ), 0) AS total_rent, ");

        // 5. Total Places Gained (effect = 1 - مدخل/إيراد)
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(prp.payed_amount)");
        sql.append("        FROM oa_place_rent_payment prp");
        sql.append("        INNER JOIN oa_rent_type rt ON prp.rent_type_id = rt.id");
        sql.append("        WHERE prp.is_deleted = 0");
        sql.append("          AND rt.effect = 1"); // effect = 1 means مدخل (Income)
        if (fromDateTime != null) {
            sql.append("          AND prp.payment_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND prp.payment_date <= :toDate");
        }
        sql.append("    ), 0) AS total_places_gained, ");

        // 6. Total Enrollment Payments
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(ep.paid_amount)");
        sql.append("        FROM oa_enrollment_payment ep");
        sql.append("        INNER JOIN oa_enrollment enr ON ep.enrollment_id = enr.id");
        sql.append("        WHERE ep.is_deleted = 0");
        sql.append("          AND ep.payment_status IN (1, 2, 6)");
        if (fromDateTime != null) {
            sql.append("          AND ep.payment_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND ep.payment_date <= :toDate");
        }
        sql.append("    ), 0) AS total_enrollment_payments, ");

        // 7. Total Enrollment Refunds
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(er.amount_refunded)");
        sql.append("        FROM oa_enrollment_refund er");
        sql.append("        INNER JOIN oa_enrollment enr ON er.enrollment_id = enr.id");
        sql.append("        WHERE er.is_deleted = 0");
        sql.append("          AND er.refund_status IN (2, 4)");
        sql.append("          AND enr.payment_status = 4");
        if (fromDateTime != null) {
            sql.append("          AND er.refund_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND er.refund_date <= :toDate");
        }
        sql.append("    ), 0) AS total_enrollment_refunds, ");

        // 8. Total Expenses
        sql.append("    COALESCE((");
        sql.append("        SELECT SUM(amount_expensed)");
        sql.append("        FROM oa_expense");
        sql.append("        WHERE is_deleted = 0");
        if (fromDateTime != null) {
            sql.append("          AND expense_date >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("          AND expense_date <= :toDate");
        }
        sql.append("    ), 0) AS total_expenses, ");

        // 9. Active Enrollments Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_enrollment");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 1");
        sql.append("       AND enrollment_status IN (1, 2)");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS active_enrollments, ");

        // 10. Inactive Enrollments Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_enrollment");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 0");
        sql.append("       AND enrollment_status != 2");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS inactive_enrollments, ");

        // 11. Active Courses Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_course");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 1");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS active_courses, ");

        // 12. Inactive Courses Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_course");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 0");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS inactive_courses, ");

        // 13. Active Trainees Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_trainee");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 1");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS active_trainees, ");

        // 14. Inactive Trainees Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_trainee");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 0");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS inactive_trainees, ");

        // 15. Active Employees Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_employee");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 1");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS active_employees, ");

        // 16. Inactive Employees Count
        sql.append("    (SELECT COUNT(*)");
        sql.append("     FROM oa_employee");
        sql.append("     WHERE is_deleted = 0");
        sql.append("       AND is_active = 0");
        if (fromDateTime != null) {
            sql.append("       AND created_on >= :fromDate");
        }
        if (toDateTime != null) {
            sql.append("       AND created_on <= :toDate");
        }
        sql.append("    ) AS inactive_employees");

        return sql.toString();
    }

    private int getIntValue(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value != null ? ((Number) value).intValue() : 0;
    }
}