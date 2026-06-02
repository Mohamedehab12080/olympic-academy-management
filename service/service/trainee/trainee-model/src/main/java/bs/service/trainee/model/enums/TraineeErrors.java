package bs.service.trainee.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

@AllArgsConstructor
public enum TraineeErrors implements Errors {

    // Trainee errors (Domain: 5001)
    TRAINEE_NOT_FOUND(TraineeDomains.TRAINEE, "0001", "المتدرب غير موجود {0}"),
    NATIONAL_ID_ALREADY_EXISTS(TraineeDomains.TRAINEE, "0002", "الرقم القومي موجود بالفعل {0}"),

    // Contact errors
    TRAINEE_CONTACT_NOT_FOUND(TraineeDomains.TRAINEE_CONTACT, "0001", "جهة الاتصال غير موجودة {0}"),

    // Certificate errors
    CERTIFICATE_NOT_FOUND(TraineeDomains.TRAINEE_CERTIFICATE, "0001", "الشهادة غير موجودة {0}"),
    CERTIFICATE_NUMBER_ALREADY_EXISTS(TraineeDomains.TRAINEE_CERTIFICATE, "0002", "رقم الشهادة موجود بالفعل {0}"),

    // Health Condition errors
    HEALTH_CONDITION_NOT_FOUND(TraineeDomains.HEALTH_CONDITION, "0001", "الحالة الصحية غير موجودة {0}");

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