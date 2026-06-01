package bs.lib.id.counter.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum CounterDomains implements Domains {
    COUNTER(1301),
    ;

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }

}
