package bs.lib.service.context.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;

import static bs.lib.service.context.model.enums.ServiceContextDomains.DOMAIN;
import static bs.lib.service.context.model.enums.ServiceContextDomains.EVENT;

@AllArgsConstructor
public enum ServiceContextErrors implements Errors {
    DOMAIN_NOT_FOUND(DOMAIN, "0001", "Domain {0} not found",""),

    EVENT_NOT_FOUND(EVENT, "0001", "this event not found {0}",""),
    CANT_SERIALIZE_EVENT_DATA(EVENT, "0002", "failed to serialize event data object",""),
    EVENT_NOT_ENABLED(EVENT, "0003", "event not enabled",""),
//    CANT_PARSE_EVENT_DATA(EVENT, "0004", "failed to parse event data object","),
//    INVALID_REQUEST(EVENT, "0005", "invalid request","),

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
