package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.EnumWithIdAndTitle;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum EmployeeAttendanceStatus implements EnumWithIdAndTitle {
    PRESENT(1,"حاضر"),ABSENT(2,"غائب"),LATE(3,"متأخر"),EXCUSED(4,"معتذر");

    public Integer id;
    public String title;
}
