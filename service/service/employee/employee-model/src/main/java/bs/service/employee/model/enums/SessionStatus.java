package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SessionStatus implements EnumWithIdAndTitle {
    SCHEDULED(1, "مجدول"),
    IN_PROGRESS(2, "في تقدم"),
    COMPLETED(3, "مكتمل"),
    CANCELLED(4,"ملغي");

    private final Integer id;
    private final String title;
}