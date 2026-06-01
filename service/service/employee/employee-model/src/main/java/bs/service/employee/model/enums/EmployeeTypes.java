package bs.service.employee.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum EmployeeTypes {
    TRAINER(1,"مدرب"),MANAGER(2,"مدير");
    public Integer id;
    public String title;
}
