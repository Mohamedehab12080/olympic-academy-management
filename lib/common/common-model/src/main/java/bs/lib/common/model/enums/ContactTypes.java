package bs.lib.common.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum ContactTypes implements EnumWithIdAndTitle {
    EMAIL(1, "بريد إلكتروني"),
    PHONE(2, "جوال");

    private final Integer id;
    private final String title;
}