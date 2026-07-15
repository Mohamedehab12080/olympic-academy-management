package bs.service.place.repository;

import bs.service.place.api.repository.PlaceReportRepository;
import bs.service.place.model.generated.PlaceReportVTO;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
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
public class PlaceReportRepositoryImpl implements PlaceReportRepository {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    @Transactional(readOnly = true)
    public PlaceReportVTO getPlaceReport(Integer placeId, LocalDate fromDate, LocalDate toDate) {
        if (placeId == null) {
            throw new IllegalArgumentException("Place ID cannot be null");
        }

        // Convert dates to LocalDateTime for query
        LocalDateTime fromDateTime = fromDate != null ? fromDate.atStartOfDay() : null;
        LocalDateTime toDateTime = toDate != null ? toDate.atTime(LocalTime.MAX) : null;

        log.info("Calculating place report for placeId: {}, from: {}, to: {}", placeId, fromDateTime, toDateTime);

        try {
            Map<String, Object> results = executePlaceReportQuery(placeId, fromDateTime, toDateTime);

            // totalPayed = Rent payments with effect = 0 (مخرج/مصروف)
            // totalGained = (Rent payments with effect = 1) + (Enrollment payments using this place)
            int totalPayed = getIntValue(results, "totalPayed");
            int totalRentGained = getIntValue(results, "totalRentGained");
            int totalEnrollmentGained = getIntValue(results, "totalEnrollmentGained");
            int totalGained = totalRentGained + totalEnrollmentGained;

            PlaceReportVTO vto = PlaceReportVTO.builder()
                    .totalPayed(totalPayed)
                    .totalGained(totalGained)
                    .build();

            log.info("Place report calculated: placeId={}, totalPayed={}, totalGained={} (Rent: {}, Enrollment: {})",
                    placeId, totalPayed, totalGained, totalRentGained, totalEnrollmentGained);

            return vto;

        } catch (Exception e) {
            log.error("Error calculating place report for placeId: {}, from: {}, to: {}",
                    placeId, fromDateTime, toDateTime, e);
            throw new RuntimeException("Failed to calculate place report", e);
        }
    }

    /**
     * Execute the place report query with date range filters
     * Uses dynamic SQL based on provided dates
     */
    @SuppressWarnings("unchecked")
    private Map<String, Object> executePlaceReportQuery(Integer placeId, LocalDateTime fromDateTime, LocalDateTime toDateTime) {

        // Build dynamic SQL with date filters
        String sql = buildDynamicQuery(fromDateTime, toDateTime);

        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("placeId", placeId);

        // Set date parameters only if they are provided
        if (fromDateTime != null) {
            query.setParameter("fromDate", fromDateTime);
        }
        if (toDateTime != null) {
            query.setParameter("toDate", toDateTime);
        }

        Object[] result = (Object[]) query.getSingleResult();

        Map<String, Object> results = new HashMap<>();
        results.put("totalPayed", result[0]);
        results.put("totalRentGained", result[1]);
        results.put("totalEnrollmentGained", result[2]);

        return results;
    }

    /**
     * Build dynamic SQL query based on provided date filters
     */
    private String buildDynamicQuery(LocalDateTime fromDateTime, LocalDateTime toDateTime) {
        StringBuilder sql = new StringBuilder();

        sql.append("SELECT ");

        // ================================================================
        // 1. Total Payed: Rent payments with effect = 0 (مخرج/مصروف)
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT SUM(prp.payed_amount) ");
        sql.append("        FROM oa_place_rent_payment prp ");
        sql.append("        INNER JOIN oa_rent_type rt ON prp.rent_type_id = rt.id ");
        sql.append("        WHERE prp.place_id = :placeId ");
        sql.append("          AND prp.is_deleted = 0 ");
        sql.append("          AND rt.effect = 0 "); // effect = 0 means مخرج (Expense)

        if (fromDateTime != null) {
            sql.append("          AND prp.payment_date >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND prp.payment_date <= :toDate ");
        }

        sql.append("    ), 0) AS total_payed, ");

        // ================================================================
        // 2. Total Rent Gained: Rent payments with effect = 1 (مدخل/إيراد)
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT SUM(prp.payed_amount) ");
        sql.append("        FROM oa_place_rent_payment prp ");
        sql.append("        INNER JOIN oa_rent_type rt ON prp.rent_type_id = rt.id ");
        sql.append("        WHERE prp.place_id = :placeId ");
        sql.append("          AND prp.is_deleted = 0 ");
        sql.append("          AND rt.effect = 1 "); // effect = 1 means مدخل (Income)

        if (fromDateTime != null) {
            sql.append("          AND prp.payment_date >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND prp.payment_date <= :toDate ");
        }

        sql.append("    ), 0) AS total_rent_gained, ");

        // ================================================================
        // 3. Total Enrollment Gained: Enrollment payments using this place
        // ================================================================
        sql.append("    COALESCE(( ");
        sql.append("        SELECT SUM(ep.paid_amount) ");
        sql.append("        FROM oa_enrollment_payment ep ");
        sql.append("        WHERE ep.is_deleted = 0 ");
        sql.append("          AND ep.payment_status IN (2, 6) "); // 2 = Completed, 6 = Partial
        sql.append("          AND EXISTS ( ");
        sql.append("              SELECT 1 ");
        sql.append("              FROM oa_enrollment enr ");
        sql.append("              WHERE enr.id = ep.enrollment_id ");
        sql.append("                AND enr.is_active = 1 "); // Active only!
        sql.append("                AND enr.is_deleted = 0 ");
        sql.append("                AND enr.enrollment_status NOT IN (3, 4) "); // Not Cancelled or Refunded
        sql.append("                AND enr.course_id IN ( ");
        sql.append("                    SELECT DISTINCT cs.course_id ");
        sql.append("                    FROM oa_course_session cs ");
        sql.append("                    WHERE cs.place_id = :placeId ");
        sql.append("                      AND cs.is_deleted = 0 ");
        sql.append("                ) ");
        sql.append("          ) ");

        if (fromDateTime != null) {
            sql.append("          AND ep.payment_date >= :fromDate ");
        }
        if (toDateTime != null) {
            sql.append("          AND ep.payment_date <= :toDate ");
        }

        sql.append("    ), 0) AS total_enrollment_gained ");

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