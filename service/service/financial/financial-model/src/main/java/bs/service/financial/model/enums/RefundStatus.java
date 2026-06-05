package bs.service.financial.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum RefundStatus {
    PENDING(1,"قيد الانتظار"),
    APPROVED(2,"موافق"),
    REJECTED(3,"مرفوض"),
    COMPLETED(4,"مكتمل");

    private final Integer id;
    private final String title;


}