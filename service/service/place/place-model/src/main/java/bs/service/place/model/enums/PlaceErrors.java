package bs.service.place.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

import static bs.service.place.model.enums.PlaceDomains.PLACE;

@AllArgsConstructor
public enum PlaceErrors implements Errors {

    PLACE_NOT_FOUND(PLACE, "0001", "المكان غير موجود {0}"),
    PLACE_TITLE_ALREADY_EXISTS(PLACE, "0002", "عنوان المكان موجود بالفعل {0}"),
    PLACE_HAS_SESSIONS(PLACE, "0003", "لا يمكن حذف المكان لوجود جلسات مرتبطة {0}");

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