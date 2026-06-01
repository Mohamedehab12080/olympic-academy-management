package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ContactTypes {
    EMAIL(1,"ايميل"),PHONE(2,"هاتف");

    public Integer id;
    public String title;
}
