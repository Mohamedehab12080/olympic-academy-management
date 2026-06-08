package bs.service.financial.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum DeductionTypes implements EnumWithIdAndTitle {
    ABSENT(1,"غياب"),
    LATE(2,"تأخير");

    private final Integer id;
    private final String title;
}
