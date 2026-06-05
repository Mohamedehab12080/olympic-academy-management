package bs.service.financial.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum FinancialErrors implements Errors {

    // Payment Method Errors
    PAYMENT_METHOD_NOT_FOUND(FinancialDomains.PAYMENT_METHOD, "0001", "طريقة الدفع غير موجودة {0}"),
    PAYMENT_METHOD_TITLE_ALREADY_EXISTS(FinancialDomains.PAYMENT_METHOD, "0002", "عنوان طريقة الدفع موجود بالفعل {0}"),
    PAYMENT_METHOD_IN_USE(FinancialDomains.PAYMENT_METHOD, "0003", "لا يمكن حذف طريقة الدفع لوجود معاملات مرتبطة {0}"),

    // Rent Type Errors
    RENT_TYPE_NOT_FOUND(FinancialDomains.RENT_TYPE, "0001", "نوع الإيجار غير موجود {0}"),
    RENT_TYPE_TITLE_ALREADY_EXISTS(FinancialDomains.RENT_TYPE, "0002", "عنوان نوع الإيجار موجود بالفعل {0}"),
    RENT_TYPE_IN_USE(FinancialDomains.RENT_TYPE, "0003", "لا يمكن حذف نوع الإيجار لوجود مدفوعات مرتبطة {0}"),

    // Expense Type Errors
    EXPENSE_TYPE_NOT_FOUND(FinancialDomains.EXPENSE_TYPE, "0001", "نوع المصروف غير موجود {0}"),
    EXPENSE_TYPE_TITLE_ALREADY_EXISTS(FinancialDomains.EXPENSE_TYPE, "0002", "عنوان نوع المصروف موجود بالفعل {0}"),
    EXPENSE_TYPE_IN_USE(FinancialDomains.EXPENSE_TYPE, "0003", "لا يمكن حذف نوع المصروف لوجود مصروفات مرتبطة {0}"),

    // Place Rent Payment Errors
    PLACE_RENT_PAYMENT_NOT_FOUND(FinancialDomains.PLACE_RENT_PAYMENT, "0001", "دفعة إيجار المكان غير موجودة {0}"),
    PLACE_NOT_FOUND_FOR_RENT(FinancialDomains.PLACE_RENT_PAYMENT, "0002", "المكان غير موجود {0}"),
    INVALID_RENT_AMOUNT(FinancialDomains.PLACE_RENT_PAYMENT, "0003", "مبلغ الإيجار غير صالح"),
    PAYED_AMOUNT_EXCEEDS_RENT(FinancialDomains.PLACE_RENT_PAYMENT, "0004", "المبلغ المدفوع يتجاوز قيمة الإيجار"),
    INVALID_PAYMENT_STATUS(FinancialDomains.PLACE_RENT_PAYMENT, "0005", "حالة الدفع غير صالحة"),

    // Expense Errors
    EXPENSE_NOT_FOUND(FinancialDomains.EXPENSE, "0001", "المصروف غير موجود {0}"),
    INVALID_EXPENSE_AMOUNT(FinancialDomains.EXPENSE, "0002", "قيمة المصروف غير صالحة"),

    // Enrollment Payment Errors
    ENROLLMENT_PAYMENT_NOT_FOUND(FinancialDomains.ENROLLMENT_PAYMENT, "0001", "دفعة التسجيل غير موجودة {0}"),
    ENROLLMENT_NOT_FOUND_FOR_PAYMENT(FinancialDomains.ENROLLMENT_PAYMENT, "0002", "التسجيل غير موجود {0}"),
    PAYMENT_AMOUNT_EXCEEDS_REMAINING(FinancialDomains.ENROLLMENT_PAYMENT, "0003", "المبلغ المدفوع يتجاوز المبلغ المتبقي"),
    ENROLLMENT_ALREADY_PAID(FinancialDomains.ENROLLMENT_PAYMENT, "0004", "التسجيل مدفوع بالكامل بالفعل"),

    // Enrollment Refund Errors
    ENROLLMENT_REFUND_NOT_FOUND(FinancialDomains.ENROLLMENT_REFUND, "0001",",استرداد التسجيل غير موجود {0}"),
    REFUND_AMOUNT_EXCEEDS_PAID(FinancialDomains.ENROLLMENT_REFUND, "0002", "مبلغ الاسترداد يتجاوز المبلغ المدفوع"),
    INVALID_REFUND_STATUS(FinancialDomains.ENROLLMENT_REFUND, "0003", "حالة الاسترداد غير صالحة"),

    // Salary Incentive Errors
    SALARY_INCENTIVE_NOT_FOUND(FinancialDomains.SALARY_INCENTIVE, "0001", "معاملة الراتب/الحافز غير موجودة {0}"),
    EMPLOYEE_NOT_FOUND_FOR_SALARY(FinancialDomains.SALARY_INCENTIVE, "0002", "الموظف غير موجود {0}"),
    INVALID_SALARY_TRANSACTION_TYPE(FinancialDomains.SALARY_INCENTIVE, "0003", "نوع المعاملة غير صالح"),
    INSUFFICIENT_REMAINED_SALARY(FinancialDomains.SALARY_INCENTIVE, "0004", "الراتب المتبقي غير كافي"),

    // Salary Deduction Errors
    SALARY_DEDUCTION_NOT_FOUND(FinancialDomains.SALARY_DEDUCTION, "0001", "خصم الراتب غير موجود {0}"),
    DEDUCTION_AMOUNT_EXCEEDS_SALARY(FinancialDomains.SALARY_DEDUCTION, "0002", "قيمة الخصم تتجاوز الراتب"),
    INVALID_SALARY_TYPE(FinancialDomains.SALARY_DEDUCTION, "0003", "نوع الراتب غير صالح");

    private final Domains domain;
    private final String code;
    private final String message;

    @Override
    public Domains domain() {
        return domain;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String message() {
        return message;
    }
}