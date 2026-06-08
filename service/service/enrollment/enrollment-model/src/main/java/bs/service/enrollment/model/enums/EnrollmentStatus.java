package bs.service.enrollment.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum EnrollmentStatus implements EnumWithIdAndTitle {
    PENDING(1,"قيد الانتظار"),COMPLETED(2,"مكتمل"),CANCELLED(3,"تم الالغاء");

    public Integer id;
    public String title;
}
