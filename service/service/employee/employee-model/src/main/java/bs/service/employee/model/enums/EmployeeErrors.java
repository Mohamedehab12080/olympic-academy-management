package bs.service.employee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum EmployeeErrors implements Errors {

    // Employee errors (Domain: 4002)
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
    FUTURE_ATTENDANCE_DATE(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0005", "لا يمكن تسجيل حضور لتاريخ مستقبلي {0}"),
    CHECK_IN_TIME_AFTER_CHECK_OUT_TIME(EmployeeDomains.EMPLOYEE_ATTENDANCE, "0006", "وقت الدخول لا يمكن أن يكون بعد وقت الخروج"),

    // Trainer Course errors (Domain: 4004)
    COURSE_NOT_FOUND_FOR_TRAINER(EmployeeDomains.EMPLOYEE, "0008", "الدورة غير موجودة {0}"),
    COURSE_ALREADY_ASSIGNED_TO_TRAINER(EmployeeDomains.EMPLOYEE, "0009", "الدورة معينة بالفعل لهذا المدرب {0}"),
    TRAINER_COURSE_ASSIGNMENT_NOT_FOUND(EmployeeDomains.EMPLOYEE, "0010", "تعيين المدرب للدورة غير موجود {0}"),

    // Course Session errors (Domain: 4005)
    COURSE_SESSION_NOT_FOUND(EmployeeDomains.COURSE_SESSION, "0001", "جلسة الدورة غير موجودة {0}"),
    START_TIME_AFTER_END_TIME(EmployeeDomains.COURSE_SESSION, "0002", "وقت البدء يجب أن يكون قبل وقت الانتهاء"),
    SESSION_DATE_IN_PAST(EmployeeDomains.COURSE_SESSION, "0003", "لا يمكن إنشاء جلسة في تاريخ مضى"),
    PLACE_NOT_FOUND_FOR_SESSION(EmployeeDomains.COURSE_SESSION, "0004", "المكان غير موجود للجلسة {0}"),
    COURSE_SESSION_TIME_CONFLICT(EmployeeDomains.COURSE_SESSION, "0005", "توجد جلسة أخرى للمدرب في نفس التوقيت {0}");

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