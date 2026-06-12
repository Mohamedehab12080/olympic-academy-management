package bs.lib.service.context.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum ServiceContextDomains implements Domains {

    DOMAIN(1001, null),
    EVENT(1002, null),

    ;

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
