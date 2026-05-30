package bs.lib.common.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum DBDomains implements Domains {

    QUERY_BUILDER(1201);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}
