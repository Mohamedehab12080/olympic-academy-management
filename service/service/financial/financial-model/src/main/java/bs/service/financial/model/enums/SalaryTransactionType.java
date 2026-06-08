package bs.service.financial.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SalaryTransactionType implements EnumWithIdAndTitle {
    SALARY(1,"راتب"),
    INCENTIVE(2,"حافز"),
    BONUS(3,"مكافأة"),
    ADVANCE(4,"سلفة");

    private final Integer id;
    private final String title;

}