package bs.service.employee.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SessionStatus {
    SCHEDULED(1, "SCHEDULED", "مجدول"),
    IN_PROGRESS(2, "IN_PROGRESS", "في تقدم"),
    COMPLETED(3, "COMPLETED", "مكتمل"),
    CANCELLED(4, "CANCELLED", "ملغي");

    private final Integer id;
    private final String title;
    private final String arabicLabel;

}