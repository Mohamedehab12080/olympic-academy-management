package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum EmployeeTypes implements EnumWithIdAndTitle {
    TRAINER(1,"مدرب"),MANAGER(2,"مدير");
    public Integer id;
    public String title;
}
