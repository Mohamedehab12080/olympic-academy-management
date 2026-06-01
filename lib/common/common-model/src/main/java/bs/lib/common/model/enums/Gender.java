package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Gender{
    MALE(1,"ذكر"),FEMALE(2,"انثي");

    public Integer id;
    public String title;
}
