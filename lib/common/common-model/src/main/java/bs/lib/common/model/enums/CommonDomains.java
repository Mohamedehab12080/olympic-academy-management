package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum CommonDomains implements Domains {
    COMMON(1401, "bs.lib.common");
    public static final String COMMON_TOPIC_NAME="#{T(bs.lib.common.model.enums.CommonDomains).COMMON.destination()}";
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
