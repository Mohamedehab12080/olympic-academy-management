package bs.lib.id.counter.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;

import static bs.lib.id.counter.model.enums.CounterDomains.COUNTER;


@AllArgsConstructor
public enum CounterErrors implements Errors {
    COUNTER_NOT_FOUND(COUNTER, "0001","Counter {0} not found "),
    COUNTER_INSTANCE_NOT_FOUND(COUNTER, "0002","Counter Instance {0} {1} not found "),
    COUNTER_ATTRIBUTE_NOT_FOUND(COUNTER, "0003","Counter attribute {0} not found "),
    MISSED_ATTRIBUTE(COUNTER, "0004","Missed {0} attribute"),
    COUNTER_(COUNTER, "0004", "Missed {0} attribute"),
    ;

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
