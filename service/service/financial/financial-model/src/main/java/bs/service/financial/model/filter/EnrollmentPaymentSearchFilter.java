package bs.service.financial.model.filter;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
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
public class EnrollmentPaymentSearchFilter extends SearchFilter<EnrollmentPaymentSearchFilter.OrderByAttributes> {

    private Integer enrollmentId;
    private Integer courseId;
    private Integer paymentMethodId;
    private Integer status;
    private LocalDate paymentDateFrom;
    private LocalDate paymentDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        PAYMENT_DATE("item.paymentDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}