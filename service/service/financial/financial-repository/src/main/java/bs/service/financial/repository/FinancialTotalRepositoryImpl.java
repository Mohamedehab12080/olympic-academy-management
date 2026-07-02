package bs.service.financial.repository;

import bs.service.financial.api.repository.FinancialTotalRepository;
import bs.service.financial.model.generated.FinancialTotalVTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.time.LocalDate;

@Slf4j
@Repository
@AllArgsConstructor
public class FinancialTotalRepositoryImpl implements FinancialTotalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public FinancialTotalVTO findFinancialTotalVTO(LocalDate from, LocalDate to) {
        // Handle null dates
        LocalDate startDate = (from != null) ? from : LocalDate.MIN; // If null, start from beginning of time
        LocalDate endDate = (to != null) ? to : LocalDate.now(); // If null, use current date

        log.info("Calculating financial totals from: {} to: {}", startDate, endDate);

        FinancialTotalVTO vto = new FinancialTotalVTO();

        try {
            // 1. Get salary and incentives
            vto.setTotalSalary(getTotalSalary(startDate, endDate));
            vto.setTotalAdvance(getTotalAdvances(startDate,endDate));
            vto.setTotalIncentives(getTotalIncentives(startDate, endDate));

            // 2. Get rent payments
            vto.setTotalPlacesRent(getTotalRent(startDate, endDate));

            // 3. Get enrollment payments
            vto.setTotalEnrollmentPayments(getTotalEnrollmentPayments(startDate, endDate));

            // 4. Get expenses
            vto.setTotalExpenses(getTotalExpenses(startDate, endDate));

            // 5. Get counts
            vto.setActiveEnrollmentsCount(getActiveEnrollmentsCount(startDate, endDate));
            vto.setInactiveEnrollmentsCount(getInactiveEnrollmentsCount(startDate, endDate));
            vto.setActiveCoursesCount(getActiveCoursesCount(startDate, endDate));
            vto.setInactiveCoursesCount(getInactiveCoursesCount(startDate, endDate));
            vto.setActiveTraineesCount(getActiveTraineesCount(startDate, endDate));
            vto.setInactiveTraineesCount(getInactiveTraineesCount(startDate, endDate));
            vto.setActiveEmployeesCount(getActiveEmployeesCount(startDate, endDate));
            vto.setInactiveEmployeesCount(getInactiveEmployeesCount(startDate, endDate));

        } catch (Exception e) {
            log.error("Error calculating financial totals for period: {} to {}", startDate, endDate, e);
            throw new RuntimeException("Failed to calculate financial totals", e);
        }

        return vto;
    }

    private int getTotalSalary(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.withdraw_date BETWEEN :startDate AND :endDate
              AND si.salary_transaction_type = 1
              AND si.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalIncentives(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.withdraw_date BETWEEN :startDate AND :endDate
              AND si.salary_transaction_type IN (2, 3)
              AND si.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalAdvances(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.withdraw_date BETWEEN :startDate AND :endDate
              AND si.salary_transaction_type=4
              AND si.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalRent(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(prp.payed_amount), 0)
            FROM oa_place_rent_payment prp
            WHERE prp.payment_date BETWEEN :startDate AND :endDate 
              AND prp.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalEnrollmentPayments(LocalDate from, LocalDate to) {
        String sql = """
        SELECT COALESCE(SUM(ep.paid_amount), 0)
        FROM oa_enrollment_payment ep
        INNER JOIN oa_enrollment enr ON ep.enrollment_id = enr.id
        WHERE ep.payment_date BETWEEN :startDate AND :endDate
          AND ep.is_deleted = 0
          AND enr.payment_status IN (1,2,6)
          AND enr.is_active=1
          AND enr.enrollment_status IN (1,2)
    """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalExpenses(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(e.amount_expensed), 0)
            FROM oa_expense e
            WHERE e.expense_date BETWEEN :startDate AND :endDate\s
              AND e.is_deleted = 0
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveEnrollmentsCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT en.id)
            FROM oa_enrollment en
            WHERE en.enrollment_status IN (1,2)
              AND en.created_on BETWEEN :startDate AND :endDate\s
              AND en.is_deleted = 0
              AND en.is_active=1
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveEnrollmentsCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT en.id)
            FROM oa_enrollment en
            WHERE en.enrollment_status != 2\s
              AND en.created_on BETWEEN :startDate AND :endDate\s
              AND en.is_deleted = 0
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveCoursesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT c.id)
            FROM oa_course c
            WHERE c.is_active = 1\s
              AND c.is_deleted = 0\s
              AND c.created_on BETWEEN :startDate AND :endDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveCoursesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT c.id)
            FROM oa_course c
            WHERE (c.is_active = 0 AND c.is_deleted = 0)\s
              AND c.created_on BETWEEN :startDate AND :endDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveTraineesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT t.id)
            FROM oa_trainee t
            WHERE t.is_active = 1\s
              AND t.is_deleted = 0\s
              AND t.created_on BETWEEN :startDate AND :endDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveTraineesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT t.id)
            FROM oa_trainee t
            WHERE (t.is_active = 0 AND t.is_deleted = 0)\s
              AND t.created_on BETWEEN :startDate AND :endDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveEmployeesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT emp.id)
            FROM oa_employee emp
            WHERE emp.is_active = 1\s
              AND emp.is_deleted = 0\s
              AND emp.created_on BETWEEN :startDate AND :endDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveEmployeesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT emp.id)
            FROM oa_employee emp
            WHERE (emp.is_active = 0 AND emp.is_deleted = 0)\s
              AND emp.created_on BETWEEN :startDate AND :endDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }
}