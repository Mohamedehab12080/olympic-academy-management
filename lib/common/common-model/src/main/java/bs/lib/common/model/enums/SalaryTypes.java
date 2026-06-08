package bs.lib.common.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum SalaryTypes implements EnumWithIdAndTitle {
    MONTHLY(1,"شهري"),HOURLY(2,"بالساعة"),DAILY(3,"يومي"),PERCENTAGE(4,"نسبة");

    public Integer id;
    public String title;
}
