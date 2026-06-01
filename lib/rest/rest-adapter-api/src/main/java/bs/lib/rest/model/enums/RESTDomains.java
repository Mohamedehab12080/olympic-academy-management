package bs.lib.rest.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum RESTDomains implements Domains {
    REST(101);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }

}
