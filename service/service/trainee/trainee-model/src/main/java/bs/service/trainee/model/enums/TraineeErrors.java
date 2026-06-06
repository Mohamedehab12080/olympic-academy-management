package bs.service.trainee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum TraineeErrors implements Errors {

    // ==================== Trainee errors (Domain: 5001) ====================
    TRAINEE_NOT_FOUND(TraineeDomains.TRAINEE, "0001", "المتدرب غير موجود {0}"),
    NATIONAL_ID_ALREADY_EXISTS(TraineeDomains.TRAINEE, "0002", "الرقم القومي موجود بالفعل {0}"),
    TRAINEE_INACTIVE(TraineeDomains.TRAINEE, "0003", "المتدرب غير نشط {0}"),
    TRAINEE_NOT_ENROLLED_IN_COURSE(TraineeDomains.TRAINEE, "0004", "المتدرب {0} غير مسجل في هذه الدورة"),

    // ==================== Contact errors (Domain: 5002) ====================
    TRAINEE_CONTACT_NOT_FOUND(TraineeDomains.TRAINEE_CONTACT, "0001", "جهة الاتصال غير موجودة {0}"),
    CONTACT_VALUE_ALREADY_EXISTS(TraineeDomains.TRAINEE_CONTACT, "0002", "قيمة جهة الاتصال موجودة بالفعل {0}"),

    // ==================== Certificate errors (Domain: 5003) ====================
    CERTIFICATE_NOT_FOUND(TraineeDomains.TRAINEE_CERTIFICATE, "0001", "الشهادة غير موجودة {0}"),
    CERTIFICATE_NUMBER_ALREADY_EXISTS(TraineeDomains.TRAINEE_CERTIFICATE, "0002", "رقم الشهادة موجود بالفعل {0}"),

    // ==================== Health Condition errors (Domain: 5004) ====================
    HEALTH_CONDITION_NOT_FOUND(TraineeDomains.HEALTH_CONDITION, "0001", "الحالة الصحية غير موجودة {0}"),
    HEALTH_CONDITION_TITLE_ALREADY_EXISTS(TraineeDomains.HEALTH_CONDITION, "0002", "عنوان الحالة الصحية موجود بالفعل {0}"),

    // ==================== Trainee Attendance errors (Domain: 5005) ====================
    ATTENDANCE_NOT_FOUND(TraineeDomains.TRAINEE_ATTENDANCE, "0001", "سجل الحضور غير موجود {0}"),
    ATTENDANCE_ALREADY_EXISTS(TraineeDomains.TRAINEE_ATTENDANCE, "0002", "سجل الحضور موجود بالفعل للمتدرب {0} في الجلسة {1}"),
    ATTENDANCE_NOT_BELONG_TO_TRAINEE(TraineeDomains.TRAINEE_ATTENDANCE, "0003", "سجل الحضور {0} لا يخص المتدرب {1}"),
    ATTENDANCE_DATE_INVALID(TraineeDomains.TRAINEE_ATTENDANCE, "0004", "تاريخ الحضور غير صالح {0}"),
    CHECK_IN_TIME_AFTER_CHECK_OUT_TIME(TraineeDomains.TRAINEE_ATTENDANCE, "0005", "وقت الدخول لا يمكن أن يكون بعد وقت الخروج"),
    LATE_TIME_INVALID(TraineeDomains.TRAINEE_ATTENDANCE, "0006", "وقت التأخير غير صالح {0}"),
    NO_ATTENDANCE_FOR_SESSION(TraineeDomains.TRAINEE_ATTENDANCE, "0007", "لا توجد سجلات حضور للجلسة {0}"),
    ATTENDANCE_ALREADY_PROCESSED(TraineeDomains.TRAINEE_ATTENDANCE, "0008", "تم معالجة سجل الحضور مسبقاً {0}"),
    SESSION_NOT_FOUND_FOR_ATTENDANCE(TraineeDomains.TRAINEE_ATTENDANCE, "0009", "الجلسة غير موجودة لسجل الحضور {0}"),
    INVALID_ATTENDANCE_STATUS(TraineeDomains.TRAINEE_ATTENDANCE, "0010", "حالة الحضور غير صالحة {0}");

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