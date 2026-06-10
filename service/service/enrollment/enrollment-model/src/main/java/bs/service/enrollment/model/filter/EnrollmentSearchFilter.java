package bs.service.enrollment.model.filter;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.util.List;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentSearchFilter extends SearchFilter<EnrollmentSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;
    private Boolean isActive;
    private Boolean isDeleted;
    private Integer traineeId;
    private Integer courseId;
    private List<Integer> courseIds;
    private Integer trainerId;
    private Integer enrollmentTypeId;
    private Integer enrollmentStatus;
    private Integer paymentStatus;
    private LocalDate startDateFrom;
    private LocalDate startDateTo;
    private LocalDate endDateFrom;
    private LocalDate endDateTo;
    private LocalDate createdOnFrom;
    private LocalDate createdOnTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        START_DATE("item.startDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}