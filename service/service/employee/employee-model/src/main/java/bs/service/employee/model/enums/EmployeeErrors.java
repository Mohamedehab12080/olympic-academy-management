package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

import static bs.service.employee.model.enums.EmployeeDomains.EMPLOYEE;

@AllArgsConstructor
public enum EmployeeErrors implements Errors {

    EMPLOYEE_NOT_FOUND(EMPLOYEE, "0001", "الموظف غير موجود {0}"),
    NATIONAL_ID_ALREADY_EXISTS(EMPLOYEE, "0002", "الرقم القومي موجود بالفعل {0}"),
    INVALID_GENDER(EMPLOYEE, "0003", "نوع الجنس غير صالح {0}"),
    INVALID_EMPLOYEE_TYPE(EMPLOYEE, "0004", "نوع الموظف غير صالح {0}"),
    INVALID_SALARY_TYPE(EMPLOYEE, "0005", "نوع الراتب غير صالح {0}"),
    EMPLOYEE_CONTACT_NOT_FOUND(EMPLOYEE, "0006", "جهة الاتصال غير موجودة {0}");

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