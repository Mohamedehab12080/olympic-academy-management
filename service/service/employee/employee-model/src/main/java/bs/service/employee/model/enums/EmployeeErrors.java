package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum EmployeeErrors implements Errors {

    // Employee errors (Domain: 4001)
    EMPLOYEE_NOT_FOUND(EmployeeDomains.EMPLOYEE, "0001", "الموظف غير موجود {0}"),
    NATIONAL_ID_ALREADY_EXISTS(EmployeeDomains.EMPLOYEE, "0002", "الرقم القومي موجود بالفعل {0}"),
    INVALID_GENDER(EmployeeDomains.EMPLOYEE, "0003", "نوع الجنس غير صالح {0}"),
    INVALID_EMPLOYEE_TYPE(EmployeeDomains.EMPLOYEE, "0004", "نوع الموظف غير صالح {0}"),
    INVALID_SALARY_TYPE(EmployeeDomains.EMPLOYEE, "0005", "نوع الراتب غير صالح {0}"),
    EMPLOYEE_HAS_ATTENDANCE_RECORDS(EmployeeDomains.EMPLOYEE, "0006", "لا يمكن حذف الموظف لوجود سجلات حضور {0}"),
    EMPLOYEE_CONTACT_NOT_FOUND(EmployeeDomains.EMPLOYEE, "0007", "جهة الاتصال غير موجودة {0}"),

    // Attendance errors (Domain: 4003)
    ATTENDANCE_NOT_FOUND(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0001", "سجل الحضور غير موجود {0}"),
    ATTENDANCE_ALREADY_EXISTS(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0002", "سجل الحضور لهذا اليوم موجود بالفعل {0}"),
    INVALID_ATTENDANCE_STATUS(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0003", "حالة الحضور غير صالحة {0}"),
    CHECK_OUT_BEFORE_CHECK_IN(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0004", "وقت الخروج يجب أن يكون بعد وقت الدخول"),
    FUTURE_ATTENDANCE_DATE(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0005", "لا يمكن تسجيل حضور لتاريخ مستقبلي {0}");

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