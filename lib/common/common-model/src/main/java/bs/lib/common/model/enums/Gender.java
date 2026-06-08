package bs.lib.common.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Gender implements EnumWithIdAndTitle {
    MALE(1,"ذكر"),FEMALE(2,"انثي");

    public Integer id;
    public String title;
}
