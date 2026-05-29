package bs.lib.sql.db.adapter.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;

import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterDomains.DB_CONFIG;
import static bs.lib.sql.db.adapter.model.enums.SQLDatabaseAdapterDomains.QUERY_BUILDER;

@AllArgsConstructor
public enum SQLDatabaseAdapterErrors implements Errors {
    UN_SUPPORTED_ORDER_BY_ATTR(QUERY_BUILDER, "0001", "Order by: {0} attribute is not supported",""),
    INVALID_SORTING_PROVIDED(QUERY_BUILDER, "0002", "Invalid sorting provided, Both 'orderBy' and 'orderDir' must be provided together",""),
    UNIQUE_CONSTRAINT_VIOLATION(DB_CONFIG, "0001", "Failed to {0} ''{1}'', due to {2} already exists","بسبب انتهاك القيد الفريد، فشلت عملية {0} لـ '{1}'، حيث أن {2} موجود مسبقاً"),
    FIELD_NOT_UPDATABLE(DB_CONFIG, "0002", "Failed to Update ''{0}'', due to ''{1}'' aren''t updatable attributes","فشلت عملية التحديث لـ '{0}'، لأن '{1}' ليست سمات قابلة للتحديث");
    ;

    private final Domains domain;
    private final String code;
    private final String messageEn;
    private final String messageAr;

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

    @Override
    public String messageAr() {
        return messageAr;
    }

}
