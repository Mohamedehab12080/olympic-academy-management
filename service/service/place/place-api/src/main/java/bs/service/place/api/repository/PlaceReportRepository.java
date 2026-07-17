package bs.service.place.api.repository;

import bs.service.place.model.generated.PlaceReportVTO;

import java.time.LocalDate;

public interface PlaceReportRepository {
    /**
     * Get place report with total payed (rent payments) and total gained (enrollment payments)
     *
     * @param placeId The ID of the place
     * @param fromDate Start date filter (optional, null means no start filter)
     * @param toDate End date filter (optional, null means no end filter)
     * @return PlaceReportVTO with totalPayed and totalGained
     */
    PlaceReportVTO getPlaceReport(Integer placeId, LocalDate fromDate, LocalDate toDate);
}
