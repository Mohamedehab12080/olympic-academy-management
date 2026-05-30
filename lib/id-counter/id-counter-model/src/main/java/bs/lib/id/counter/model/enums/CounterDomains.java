package bs.lib.id.counter.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum CounterDomains implements Domains {
    COUNTER(1301, "bs.lib.id.counter"),
    ;

    public static final String COUNTER_TOPIC_NAME = "#{T(bs.lib.id.counter.model.enums.CounterDomains).COUNTER.destination()}";
    private final Integer id;
    private final String destination;

    @Override
    public Integer id() {
        return id;
    }

    @Override
    public String destination() {
        return destination;
    }

}
