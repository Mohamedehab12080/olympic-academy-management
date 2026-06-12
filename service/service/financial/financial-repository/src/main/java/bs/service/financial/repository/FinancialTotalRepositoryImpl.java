package bs.service.financial.repository;

import bs.service.financial.api.repository.FinancialTotalRepository;
import bs.service.financial.model.generated.FinancialTotalVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import java.time.LocalDate;

@Repository
@AllArgsConstructor
public class FinancialTotalRepositoryImpl implements FinancialTotalRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public FinancialTotalVTO findFinancialTotalVTO(LocalDate from, LocalDate to) {
        String sql = """
            WITH 
            financial_data AS (
                SELECT
                    COALESCE(SUM(CASE WHEN si.salary_type = 1 AND si.salary_transaction_type = 1 THEN si.amount_withdrawn END), 0) AS total_salary,
                    COALESCE(SUM(CASE WHEN si.salary_type = 1 AND si.salary_transaction_type IN (2, 3) THEN si.amount_withdrawn END), 0) AS total_incentives,
                    COALESCE(SUM(prp.payed_amount), 0) AS total_rent,
                    COALESCE(SUM(ep.paid_amount), 0) AS total_payments,
                    COALESCE(SUM(e.amount_expensed), 0) AS total_expenses
                FROM (SELECT 1) dummy
                LEFT JOIN oa_salary_incentive si ON si.withdraw_date BETWEEN :startDate AND :endDate AND si.is_deleted = 0
                LEFT JOIN oa_place_rent_payment prp ON prp.payment_date BETWEEN :startDate AND :endDate AND prp.is_deleted = 0
                LEFT JOIN oa_enrollment_payment ep ON ep.payment_date BETWEEN :startDate AND :endDate AND ep.is_deleted = 0 AND ep.payment_status = 2
                LEFT JOIN oa_expense e ON e.expense_date BETWEEN :startDate AND :endDate AND e.is_deleted = 0
            ),
            status_counts AS (
                SELECT
                    COUNT(DISTINCT CASE WHEN en.enrollment_status = 2 AND en.created_on BETWEEN :startDate AND :endDate THEN en.id END) AS active_enrollments,
                    COUNT(DISTINCT CASE WHEN en.enrollment_status != 2 AND en.created_on BETWEEN :startDate AND :endDate THEN en.id END) AS inactive_enrollments,
                    COUNT(DISTINCT CASE WHEN c.is_active = 1 AND c.is_deleted = 0 AND c.created_on BETWEEN :startDate AND :endDate THEN c.id END) AS active_courses,
                    COUNT(DISTINCT CASE WHEN (c.is_active = 0 OR c.is_deleted = 1) AND c.created_on BETWEEN :startDate AND :endDate THEN c.id END) AS inactive_courses,
                    COUNT(DISTINCT CASE WHEN t.is_active = 1 AND t.is_deleted = 0 AND t.created_on BETWEEN :startDate AND :endDate THEN t.id END) AS active_trainees,
                    COUNT(DISTINCT CASE WHEN (t.is_active = 0 OR t.is_deleted = 1) AND t.created_on BETWEEN :startDate AND :endDate THEN t.id END) AS inactive_trainees,
                    COUNT(DISTINCT CASE WHEN emp.is_active = 1 AND emp.is_deleted = 0 AND emp.created_on BETWEEN :startDate AND :endDate THEN emp.id END) AS active_employees,
                    COUNT(DISTINCT CASE WHEN (emp.is_active = 0 OR emp.is_deleted = 1) AND emp.created_on BETWEEN :startDate AND :endDate THEN emp.id END) AS inactive_employees
                FROM (SELECT 1) dummy
                LEFT JOIN oa_enrollment en ON en.created_on BETWEEN :startDate AND :endDate AND en.is_deleted = 0
                LEFT JOIN oa_course c ON c.created_on BETWEEN :startDate AND :endDate AND c.is_deleted = 0
                LEFT JOIN oa_trainee t ON t.created_on BETWEEN :startDate AND :endDate AND t.is_deleted = 0
                LEFT JOIN oa_employee emp ON emp.created_on BETWEEN :startDate AND :endDate AND emp.is_deleted = 0
            )
            SELECT 
                fd.total_salary AS totalSalary,
                fd.total_incentives AS totalIncentives,
                fd.total_rent AS totalPlacesRent,
                fd.total_payments AS totalEnrollmentPayments,
                fd.total_expenses AS totalExpenses,
                sc.active_enrollments AS activeEnrollmentsCount,
                sc.active_courses AS activeCoursesCount,
                sc.active_trainees AS activeTraineesCount,
                sc.active_employees AS activeEmployeesCount,
                sc.inactive_enrollments AS inactiveEnrollmentsCount,
                sc.inactive_courses AS inactiveCoursesCount,
                sc.inactive_trainees AS inactiveTraineesCount,
                sc.inactive_employees AS inactiveEmployeesCount
            FROM financial_data fd
            CROSS JOIN status_counts sc
        """;

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("startDate", from);
        query.setParameter("endDate", to);

        Object[] result = (Object[]) query.getSingleResult();

        return mapToFinancialTotalVTO(result);
    }

    private FinancialTotalVTO mapToFinancialTotalVTO(Object[] result) {
        FinancialTotalVTO vto = new FinancialTotalVTO();
        vto.setTotalSalary(((Number) result[0]).intValue());
        vto.setTotalIncentives(((Number) result[1]).intValue());
        vto.setTotalPlacesRent(((Number) result[2]).intValue());
        vto.setTotalEnrollmentPayments(((Number) result[3]).intValue());
        vto.setTotalExpenses(((Number) result[4]).intValue());
        vto.setActiveEnrollmentsCount(((Number) result[5]).intValue());
        vto.setActiveCoursesCount(((Number) result[6]).intValue());
        vto.setActiveTraineesCount(((Number) result[7]).intValue());
        vto.setActiveEmployeesCount(((Number) result[8]).intValue());
        vto.setInactiveEnrollmentsCount(((Number) result[9]).intValue());
        vto.setInactiveCoursesCount(((Number) result[10]).intValue());
        vto.setInactiveTraineesCount(((Number) result[11]).intValue());
        vto.setInactiveEmployeesCount(((Number) result[12]).intValue());
        return vto;
    }
}