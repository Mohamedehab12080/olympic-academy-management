package bs.service.enrollment.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum EnrollmentErrors implements Errors {

    // Enrollment Type errors (Domain: 6001)
    ENROLLMENT_TYPE_NOT_FOUND(EnrollmentDomains.ENROLLMENT_TYPE, "0001", "نوع التسجيل غير موجود {0}"),
    ENROLLMENT_TYPE_TITLE_ALREADY_EXISTS(EnrollmentDomains.ENROLLMENT_TYPE, "0002", "عنوان نوع التسجيل موجود بالفعل {0}"),
    ENROLLMENT_TYPE_HAS_ENROLLMENTS(EnrollmentDomains.ENROLLMENT_TYPE, "0003", "لا يمكن حذف نوع التسجيل لوجود تسجيلات مرتبطة {0}"),

    // Enrollment errors (Domain: 6002)
    ENROLLMENT_NOT_FOUND(EnrollmentDomains.ENROLLMENT, "0001", "التسجيل غير موجود {0}"),
    ENROLLMENT_ALREADY_EXISTS(EnrollmentDomains.ENROLLMENT, "0002", "التسجيل موجود بالفعل لهذا المتدرب في هذه الدورة {0}"),
    TRAINEE_NOT_FOUND_FOR_ENROLLMENT(EnrollmentDomains.ENROLLMENT, "0003", "المتدرب غير موجود للتسجيل {0}"),
    COURSE_NOT_FOUND_FOR_ENROLLMENT(EnrollmentDomains.ENROLLMENT, "0004", "الدورة غير موجودة للتسجيل {0}"),
    TRAINER_NOT_FOUND_FOR_ENROLLMENT(EnrollmentDomains.ENROLLMENT, "0005", "المدرب غير موجود للتسجيل {0}"),
    INVALID_ENROLLMENT_STATUS(EnrollmentDomains.ENROLLMENT, "0006", "حالة التسجيل غير صالحة {0}"),
    INVALID_PAYMENT_STATUS(EnrollmentDomains.ENROLLMENT, "0007", "حالة الدفع غير صالحة {0}"),
    COURSE_FULL_CAPACITY(EnrollmentDomains.ENROLLMENT, "0008", "الدورة ممتلئة لا يمكن تسجيل متدربين جدد {0}"),
    START_DATE_CANNOT_BE_IN_PAST(EnrollmentDomains.ENROLLMENT, "0009", "تاريخ البدء لا يمكن أن يكون في الماضي {0}"),
    END_DATE_BEFORE_START_DATE(EnrollmentDomains.ENROLLMENT, "0010", "تاريخ الانتهاء يجب أن يكون بعد تاريخ البدء {0}");

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