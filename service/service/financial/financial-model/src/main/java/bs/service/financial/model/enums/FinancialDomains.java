package bs.service.financial.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum FinancialDomains implements Domains {
    PAYMENT_METHOD(8001),
    RENT_TYPE(8002),
    EXPENSE_TYPE(8003),
    PLACE_RENT_PAYMENT(8004),
    EXPENSE(8005),
    ENROLLMENT_PAYMENT(8006),
    ENROLLMENT_REFUND(8007),
    SALARY_INCENTIVE(8008),
    SALARY_DEDUCTION(8009);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }

}
