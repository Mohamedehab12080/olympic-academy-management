package bs.lib.common.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum PaymentStatus {
    PENDING(1,"قيد الانتظار"),PAID(2,"تم الدفع"),FAILED(3,"فشل"),REFUNDED(4,"تم استرداد المبلغ"),CANCELLED(5,"تم الالغاء");

    public Integer id;
    public String title;
}
