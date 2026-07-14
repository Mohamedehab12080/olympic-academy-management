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
        log.info("Calculating financial totals from: {} to: {}", from, to);

        FinancialTotalVTO vto = new FinancialTotalVTO();

        try {
            // 1. Get salary and incentives
            vto.setTotalSalary(getTotalSalary(from, to));
            vto.setTotalAdvance(getTotalAdvances(from, to));
            vto.setTotalIncentives(getTotalIncentives(from, to));

            // 2. Get rent payments
            vto.setTotalPlacesRent(getTotalRent(from, to));

            // 3. Get enrollment payments
            vto.setTotalEnrollmentPayments(getTotalEnrollmentPayments(from, to));
            vto.setTotalEnrollmentRefunds(getTotalEnrollmentRefund(from, to));

            // 4. Get expenses
            vto.setTotalExpenses(getTotalExpenses(from, to));

            // 5. Get counts
            vto.setActiveEnrollmentsCount(getActiveEnrollmentsCount(from, to));
            vto.setInactiveEnrollmentsCount(getInactiveEnrollmentsCount(from, to));
            vto.setActiveCoursesCount(getActiveCoursesCount(from, to));
            vto.setInactiveCoursesCount(getInactiveCoursesCount(from, to));
            vto.setActiveTraineesCount(getActiveTraineesCount(from, to));
            vto.setInactiveTraineesCount(getInactiveTraineesCount(from, to));
            vto.setActiveEmployeesCount(getActiveEmployeesCount(from, to));
            vto.setInactiveEmployeesCount(getInactiveEmployeesCount(from, to));

        } catch (Exception e) {
            log.error("Error calculating financial totals for period: {} to {}", from, to, e);
            throw new RuntimeException("Failed to calculate financial totals", e);
        }

        return vto;
    }

    private int getTotalSalary(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.is_deleted = 0
              AND si.salary_transaction_type = 1
              AND (:startDate IS NULL OR si.withdraw_date >= :startDate)
              AND (:endDate IS NULL OR si.withdraw_date <= :endDate)
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
            WHERE si.is_deleted = 0
              AND si.salary_transaction_type IN (2, 3)
              AND (:startDate IS NULL OR si.withdraw_date >= :startDate)
              AND (:endDate IS NULL OR si.withdraw_date <= :endDate)
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
            WHERE si.is_deleted = 0
              AND si.salary_transaction_type = 4
              AND (:startDate IS NULL OR si.withdraw_date >= :startDate)
              AND (:endDate IS NULL OR si.withdraw_date <= :endDate)
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
            WHERE prp.is_deleted = 0
              AND (:startDate IS NULL OR prp.payment_date >= :startDate)
              AND (:endDate IS NULL OR prp.payment_date <= :endDate)
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
            WHERE ep.is_deleted = 0
              AND enr.payment_status IN (1,2,6)
              AND enr.is_active = 1
              AND enr.enrollment_status IN (1,2)
              AND (:startDate IS NULL OR ep.payment_date >= :startDate)
              AND (:endDate IS NULL OR ep.payment_date <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalEnrollmentRefund(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COALESCE(SUM(er.amount_refunded), 0)
            FROM oa_enrollment_refund er
            INNER JOIN oa_enrollment enr ON er.enrollment_id = enr.id
            WHERE er.is_deleted = 0
              AND er.refund_status IN (2,4)
              AND enr.payment_status = 4
              AND enr.is_active = 1
              AND enr.enrollment_status = 3
              AND (:startDate IS NULL OR er.refund_date >= :startDate)
              AND (:endDate IS NULL OR er.refund_date <= :endDate)
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
            WHERE e.is_deleted = 0
              AND (:startDate IS NULL OR e.expense_date >= :startDate)
              AND (:endDate IS NULL OR e.expense_date <= :endDate)
        """;
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
              AND en.is_deleted = 0
              AND en.is_active = 1
              AND (:startDate IS NULL OR en.created_on >= :startDate)
              AND (:endDate IS NULL OR en.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveEnrollmentsCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT en.id)
            FROM oa_enrollment en
            WHERE en.enrollment_status != 2
              AND en.is_deleted = 0
              AND en.is_active = 0
              AND (:startDate IS NULL OR en.created_on >= :startDate)
              AND (:endDate IS NULL OR en.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveCoursesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT c.id)
            FROM oa_course c
            WHERE c.is_active = 1
              AND c.is_deleted = 0
              AND (:startDate IS NULL OR c.created_on >= :startDate)
              AND (:endDate IS NULL OR c.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveCoursesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT c.id)
            FROM oa_course c
            WHERE c.is_active = 0
              AND c.is_deleted = 0
              AND (:startDate IS NULL OR c.created_on >= :startDate)
              AND (:endDate IS NULL OR c.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveTraineesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT t.id)
            FROM oa_trainee t
            WHERE t.is_active = 1
              AND t.is_deleted = 0
              AND (:startDate IS NULL OR t.created_on >= :startDate)
              AND (:endDate IS NULL OR t.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveTraineesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT t.id)
            FROM oa_trainee t
            WHERE t.is_active = 0
              AND t.is_deleted = 0
              AND (:startDate IS NULL OR t.created_on >= :startDate)
              AND (:endDate IS NULL OR t.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveEmployeesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT emp.id)
            FROM oa_employee emp
            WHERE emp.is_active = 1
              AND emp.is_deleted = 0
              AND (:startDate IS NULL OR emp.created_on >= :startDate)
              AND (:endDate IS NULL OR emp.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveEmployeesCount(LocalDate from, LocalDate to) {
        String sql = """
            SELECT COUNT(DISTINCT emp.id)
            FROM oa_employee emp
            WHERE emp.is_active = 0
              AND emp.is_deleted = 0
              AND (:startDate IS NULL OR emp.created_on >= :startDate)
              AND (:endDate IS NULL OR emp.created_on <= :endDate)
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);
        return ((Number) query.getSingleResult()).intValue();
    }
}