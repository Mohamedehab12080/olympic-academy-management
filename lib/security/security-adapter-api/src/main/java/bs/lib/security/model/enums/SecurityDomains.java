package bs.lib.security.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum SecurityDomains implements Domains {

    JWT_TOKEN(1001);
    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}
