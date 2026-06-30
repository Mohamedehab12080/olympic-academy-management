package bs.service.financial.repository;

import bs.service.financial.api.repository.MainTotalRepository;
import bs.service.financial.model.generated.FinancialTotalVTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;

@Slf4j
@Repository
@AllArgsConstructor
public class MainTotalRepositoryImpl implements MainTotalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public FinancialTotalVTO findMainFinancialTotalVTO(String year) {
        LocalDate yearOfDate;
        if (year != null) {
            int yearInt = Integer.parseInt(year);
            // Get December 31 of the given year (always valid)
            yearOfDate = LocalDate.of(yearInt, 12, 31);
        } else {
            yearOfDate = LocalDate.now();
        }

        log.info("Calculating financial totals for period ending: {}", yearOfDate);

        FinancialTotalVTO vto = new FinancialTotalVTO();

        try {
            vto.setTotalSalary(getTotalSalary(yearOfDate));
            vto.setTotalAdvance(getTotalAdvances(yearOfDate));
            vto.setTotalIncentives(getTotalIncentives(yearOfDate));
            vto.setTotalPlacesRent(getTotalRent(yearOfDate));
            vto.setTotalEnrollmentPayments(getTotalEnrollmentPayments(yearOfDate));
            vto.setTotalExpenses(getTotalExpenses(yearOfDate));
            vto.setActiveEnrollmentsCount(getActiveEnrollmentsCount(yearOfDate));
            vto.setInactiveEnrollmentsCount(getInactiveEnrollmentsCount(yearOfDate));
            vto.setActiveCoursesCount(getActiveCoursesCount(yearOfDate));
            vto.setInactiveCoursesCount(getInactiveCoursesCount(yearOfDate));
            vto.setActiveTraineesCount(getActiveTraineesCount(yearOfDate));
            vto.setInactiveTraineesCount(getInactiveTraineesCount(yearOfDate));
            vto.setActiveEmployeesCount(getActiveEmployeesCount(yearOfDate));
            vto.setInactiveEmployeesCount(getInactiveEmployeesCount(yearOfDate));

        } catch (Exception e) {
            log.error("Error calculating financial totals for period: {} ", yearOfDate, e);
            throw new RuntimeException("Failed to calculate financial totals", e);
        }

        return vto;
    }


    private int getTotalSalary(LocalDate yearOfDate) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.withdraw_date <=:startDate
              AND si.salary_transaction_type = 1
              AND si.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalAdvances(LocalDate yearOfDate) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.withdraw_date <=:startDate
              AND si.salary_transaction_type = 4
              AND si.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalIncentives(LocalDate yearOfDate) {
        String sql = """
            SELECT COALESCE(SUM(si.amount_withdrawn), 0)
            FROM oa_salary_incentive si
            WHERE si.withdraw_date <=:startDate
              AND si.salary_transaction_type IN (2, 3)
              AND si.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalRent(LocalDate yearOfDate) {
        String sql = """
            SELECT COALESCE(SUM(prp.payed_amount), 0)
            FROM oa_place_rent_payment prp
            WHERE prp.payment_date <=:startDate
              AND prp.is_deleted = 0
        """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getTotalEnrollmentPayments(LocalDate yearOfDate) {
        String sql = """
        SELECT COALESCE(SUM(ep.paid_amount), 0)
        FROM oa_enrollment_payment ep
        INNER JOIN oa_enrollment enr ON ep.enrollment_id = enr.id
        WHERE ep.payment_date <= :startDate
          AND ep.is_deleted = 0
          AND enr.payment_status IN (1,2,6)
          AND enr.is_active=1
          AND enr.enrollment_status IN (1,2)
    """;
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }


    private int getTotalExpenses(LocalDate yearOfDate) {
        String sql = """
            SELECT COALESCE(SUM(e.amount_expensed), 0)
            FROM oa_expense e
            WHERE e.expense_date <=:startDate \s
              AND e.is_deleted = 0
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveEnrollmentsCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT en.id)
            FROM oa_enrollment en
            WHERE en.created_on <=:startDate \s
              AND en.is_deleted = 0
              AND en.is_active = 1
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveEnrollmentsCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT en.id)
            FROM oa_enrollment en
            WHERE en.enrollment_status != 2\s
              AND en.created_on <=:startDate \s
              AND en.is_deleted = 0
              AND en.is_active=0
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveCoursesCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT c.id)
            FROM oa_course c
            WHERE c.is_active = 1\s
              AND c.is_deleted = 0\s
              AND c.created_on <=:startDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveCoursesCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT c.id)
            FROM oa_course c
            WHERE (c.is_active = 0 AND c.is_deleted = 0)\s
              AND c.created_on <=:startDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveTraineesCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT t.id)
            FROM oa_trainee t
            WHERE t.is_active = 1\s
              AND t.is_deleted = 0\s
              AND t.created_on <=:startDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveTraineesCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT t.id)
            FROM oa_trainee t
            WHERE (t.is_active = 0 AND t.is_deleted = 0)\s
              AND t.created_on <=:startDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getActiveEmployeesCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT emp.id)
            FROM oa_employee emp
            WHERE emp.is_active = 1\s
              AND emp.is_deleted = 0\s
              AND emp.created_on <=:startDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

    private int getInactiveEmployeesCount(LocalDate yearOfDate) {
        String sql = """
            SELECT COUNT(DISTINCT emp.id)
            FROM oa_employee emp
            WHERE (emp.is_active = 0 AND emp.is_deleted = 0)\s
              AND emp.created_on <= :startDate
       \s""";
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", yearOfDate.atStartOfDay());
        return ((Number) query.getSingleResult()).intValue();
    }

}
