package bs.service.financial.repository;

import bs.service.financial.api.repository.MainTotalRepository;
import bs.service.financial.model.generated.FinancialTotalVTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
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

    private static final int CACHE_TTL = 300; // 5 minutes

    @Override
    @Cacheable(value = "dashboardTotals", key = "#year", unless = "#result == null")
    @Transactional(readOnly = true)
    public FinancialTotalVTO findMainFinancialTotalVTO(String year) {
        LocalDateTime cutoffDate = getCutoffDateTime(year);

        log.info("Calculating financial totals for period ending: {}", cutoffDate);

        FinancialTotalVTO vto = new FinancialTotalVTO();

        try {
            // Execute optimized single query with subqueries
            Map<String, Object> results = executeAllQueries(cutoffDate);

            // Set all values from results map
            setVTOValues(vto, results);

            // Log summary
            logDashboardTotals(vto);

        } catch (Exception e) {
            log.error("Error calculating financial totals for period: {}", cutoffDate, e);
            throw new RuntimeException("Failed to calculate financial totals", e);
        }

        return vto;
    }

    /**
     * Execute all dashboard queries in a SINGLE SQL statement using subqueries
     * This reduces network round-trips from 16 to 1
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> executeAllQueries(LocalDateTime cutoffDate) {
        String sql = buildOptimizedQuery();

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("cutoffDate", cutoffDate);

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
     * Build optimized SQL query with proper formatting
     * Includes totalPlacesGained (rent payments with effect = 1)
     */
    private String buildOptimizedQuery() {
        return """
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
                
                -- Places Rent (effect = 0 - مخرج/مصروف)
                COALESCE((
                    SELECT SUM(rp.payed_amount)
                    FROM oa_place_rent_payment rp
                    INNER JOIN oa_rent_type rt ON rp.rent_type_id = rt.id
                    WHERE rp.payment_date <= :cutoffDate
                      AND rp.is_deleted = 0
                      AND rt.effect = 0
                ), 0) AS total_rent,
                
                -- Places Gained (effect = 1 - مدخل/إيراد)
                COALESCE((
                    SELECT SUM(rp.payed_amount)
                    FROM oa_place_rent_payment rp
                    INNER JOIN oa_rent_type rt ON rp.rent_type_id = rt.id
                    WHERE rp.payment_date <= :cutoffDate
                      AND rp.is_deleted = 0
                      AND rt.effect = 1
                ), 0) AS total_places_gained,
                
                -- Enrollment Payments
                COALESCE((
                    SELECT SUM(ep.paid_amount)
                    FROM oa_enrollment_payment ep
                    INNER JOIN oa_enrollment enr ON ep.enrollment_id = enr.id
                    WHERE ep.payment_date <= :cutoffDate
                      AND ep.is_deleted = 0
                      AND ep.payment_status IN (1, 2, 6)
                ), 0) AS total_enrollment_payments,
                
                -- Enrollment Refunds
                COALESCE((
                    SELECT SUM(er.amount_refunded)
                    FROM oa_enrollment_refund er
                    INNER JOIN oa_enrollment enr ON er.enrollment_id = enr.id
                    WHERE er.refund_date <= :cutoffDate
                      AND er.is_deleted = 0
                      AND er.refund_status IN (2, 4)
                      AND enr.payment_status = 4
                ), 0) AS total_enrollment_refunds,
                
                -- Expenses
                COALESCE((
                    SELECT SUM(amount_expensed)
                    FROM oa_expense
                    WHERE expense_date <= :cutoffDate
                      AND is_deleted = 0
                ), 0) AS total_expenses,
                
                -- Active Enrollments
                (SELECT COUNT(*)
                 FROM oa_enrollment
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_enrollments,
                
                -- Inactive Enrollments
                (SELECT COUNT(*)
                 FROM oa_enrollment
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0
                   AND enrollment_status != 2) AS inactive_enrollments,
                
                -- Active Courses
                (SELECT COUNT(*)
                 FROM oa_course
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_courses,
                
                -- Inactive Courses
                (SELECT COUNT(*)
                 FROM oa_course
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0) AS inactive_courses,
                
                -- Active Trainees
                (SELECT COUNT(*)
                 FROM oa_trainee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_trainees,
                
                -- Inactive Trainees
                (SELECT COUNT(*)
                 FROM oa_trainee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0) AS inactive_trainees,
                
                -- Active Employees
                (SELECT COUNT(*)
                 FROM oa_employee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 1) AS active_employees,
                
                -- Inactive Employees
                (SELECT COUNT(*)
                 FROM oa_employee
                 WHERE created_on <= :cutoffDate
                   AND is_deleted = 0
                   AND is_active = 0) AS inactive_employees
        """;
    }

    /**
     * Set VTO values from results map
     */
    private void setVTOValues(FinancialTotalVTO vto, Map<String, Object> results) {
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
    }

    /**
     * Log dashboard totals in a structured format
     */
    private void logDashboardTotals(FinancialTotalVTO vto) {
        log.info("=== DASHBOARD TOTALS ===");
        log.info("📊 Revenue & Income:");
        log.info("  Total Enrollment Payments: {}", vto.getTotalEnrollmentPayments());
        log.info("  Total Places Gained (Income): {}", vto.getTotalPlacesGained());
        log.info("  Total Incentives: {}", vto.getTotalIncentives());
        log.info("");
        log.info("💳 Expenses & Payments:");
        log.info("  Total Salary: {}", vto.getTotalSalary());
        log.info("  Total Rent (Expense): {}", vto.getTotalPlacesRent());
        log.info("  Total Other Expenses: {}", vto.getTotalExpenses());
        log.info("  Total Advances: {}", vto.getTotalAdvance());
        log.info("");
        log.info("🔄 Refunds:");
        log.info("  Total Enrollment Refunds: {}", vto.getTotalEnrollmentRefunds());
        log.info("");
        log.info("👥 Active Counts:");
        log.info("  Active Enrollments: {}", vto.getActiveEnrollmentsCount());
        log.info("  Active Courses: {}", vto.getActiveCoursesCount());
        log.info("  Active Trainees: {}", vto.getActiveTraineesCount());
        log.info("  Active Employees: {}", vto.getActiveEmployeesCount());
        log.info("");
        log.info("⏸️ Inactive Counts:");
        log.info("  Inactive Enrollments: {}", vto.getInactiveEnrollmentsCount());
        log.info("  Inactive Courses: {}", vto.getInactiveCoursesCount());
        log.info("  Inactive Trainees: {}", vto.getInactiveTraineesCount());
        log.info("  Inactive Employees: {}", vto.getInactiveEmployeesCount());
        log.info("");
        log.info("📈 Summary:");
        int totalIncome = (vto.getTotalPlacesGained() != null ? vto.getTotalPlacesGained() : 0)
                + (vto.getTotalEnrollmentPayments() != null ? vto.getTotalEnrollmentPayments() : 0)
                + (vto.getTotalIncentives() != null ? vto.getTotalIncentives() : 0);
        int totalExpenses = (vto.getTotalSalary() != null ? vto.getTotalSalary() : 0)
                + (vto.getTotalPlacesRent() != null ? vto.getTotalPlacesRent() : 0)
                + (vto.getTotalExpenses() != null ? vto.getTotalExpenses() : 0);
        log.info("  Total Income: {}", totalIncome);
        log.info("  Total Expenses: {}", totalExpenses);
        log.info("  Net Profit/Loss: {}", totalIncome - totalExpenses);
        log.info("=================================");
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

    /**
     * Optional: Clear cache when data changes
     */
    public void clearDashboardCache() {
        log.info("Clearing dashboard cache");
        // Implementation depends on your cache manager
        // If using Spring Cache:
        // CacheManager cacheManager; cacheManager.getCache("dashboardTotals").clear();
    }
}