package bs.olympic.common.security.model.enums;

import bs.olympic.common.model.interfaces.Domains;
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
