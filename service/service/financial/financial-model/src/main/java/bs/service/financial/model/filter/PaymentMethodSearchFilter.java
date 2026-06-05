package bs.service.financial.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class PaymentMethodSearchFilter extends SearchFilter<PaymentMethodSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        TITLE("item.title", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}