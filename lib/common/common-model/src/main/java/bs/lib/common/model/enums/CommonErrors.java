package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;

import static bs.lib.common.model.enums.CommonDomains.COMMON;

@AllArgsConstructor
public enum CommonErrors implements Errors {
    INVALID_DATE_RANGE_FROM_AFTER_TO(COMMON, "0001", "تاريخ البداية لا يمكن أن يكون بعد تاريخ النهاية"),
    INVALID_VALUE_RANGE_MIN_AFTER_MAX(COMMON, "0002", "يجب أن يكون الحد الأقصى للقيمة أكبر من أو يساوي الحد الأدنى للقيمة.");

    private final Domains domain;
    private final String code;
    private final String message;

    @Override
    public Domains domain() {
        return domain;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String message() {
        return message;
    }

}
