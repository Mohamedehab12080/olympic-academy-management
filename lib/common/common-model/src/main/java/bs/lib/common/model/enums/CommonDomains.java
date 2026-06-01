package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum CommonDomains implements Domains {
    COMMON(1401);
    private final Integer id;
    @Override
    public Integer id() {
        return id;
    }
}
