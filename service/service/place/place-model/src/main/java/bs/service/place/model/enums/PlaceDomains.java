package bs.service.place.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum PlaceDomains implements Domains {
    PLACE(7002);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}