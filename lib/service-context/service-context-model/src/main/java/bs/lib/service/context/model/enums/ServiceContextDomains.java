package bs.lib.service.context.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum ServiceContextDomains implements Domains {

    DOMAIN(1001),
    EVENT(1002),

    ;

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }

}
