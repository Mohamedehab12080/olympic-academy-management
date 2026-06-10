package bs.service.financial.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import bs.service.financial.model.enums.RefundStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EnrollmentRefundSearchFilter extends SearchFilter<EnrollmentRefundSearchFilter.OrderByAttributes> {

    private Integer enrollmentId;
    private Integer courseId;
    private Integer paymentMethodId;
    private Integer status;
    private LocalDate refundDateFrom;
    private LocalDate refundDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        REFUND_DATE("item.refundDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}