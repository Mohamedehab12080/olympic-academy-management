package bs.lib.common.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

import static bs.lib.common.model.enums.DBDomains.QUERY_BUILDER;

@AllArgsConstructor
public enum DBErrors implements Errors {
    UN_SUPPORTED_ORDER_BY_ATTR(QUERY_BUILDER, "0001", "Order by: {0} attribute is not supported"),
    INVALID_SORTING_PROVIDED(QUERY_BUILDER, "0002", "Invalid sorting provided, Both 'orderBy' and 'orderDir' must be provided together");

    private final Domains domain;
    private final String code;
    private final String messageEn;

    @Override
    public Domains domain() {
        return domain;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String messageEn() {
        return messageEn;
    }
}
