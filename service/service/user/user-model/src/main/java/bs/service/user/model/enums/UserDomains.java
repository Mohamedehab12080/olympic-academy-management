package bs.service.user.model.enums;

import bs.olympic.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum UserDomains implements Domains {

    USER(2201),;
    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}
