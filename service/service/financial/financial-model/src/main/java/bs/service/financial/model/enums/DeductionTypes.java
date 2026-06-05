package bs.service.financial.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum DeductionTypes {
    ABSENT(1,"غياب"),
    LATE(2,"تأخير");

    private final Integer id;
    private final String title;
}
