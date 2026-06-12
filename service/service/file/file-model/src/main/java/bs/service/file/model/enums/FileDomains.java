package bs.service.file.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum FileDomains implements Domains {
    FILE(2101);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }

}
