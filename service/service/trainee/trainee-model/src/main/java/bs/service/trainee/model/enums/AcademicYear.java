package bs.service.trainee.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum AcademicYear implements EnumWithIdAndTitle {

    _1(1,"1"),
    _2(2,"2"),
    _3(3,"3"),
    _4(4,"4");

    public final Integer id;
    public final String title;
}
