package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum EmployeeDomains implements Domains {
        EMPLOYEE(4002),
    EMPLOYEE_ATTENDANCE(4003),
    TRAINER_COURSE(4004),
    COURSE_SESSION(4005);

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }
}