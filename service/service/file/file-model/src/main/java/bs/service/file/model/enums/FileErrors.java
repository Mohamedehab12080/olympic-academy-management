package bs.service.file.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;

@AllArgsConstructor
public enum FileErrors implements Errors {
    FILE_NOT_FOUND(FileDomains.FILE, "0001", "الملف غير موجود"),
    NOT_ALLOWED_EXTENSION(FileDomains.FILE, "0002", "امتداد الملف غير مسموح به"),
    EXCEED_MAX_SIZE(FileDomains.FILE, "0003", "حجم الملف يتجاوز الحد المسموح"),
    FILE_UPLOAD_FAILED(FileDomains.FILE, "0005", "تعذر رفع الملف بسبب"),
    FILE_VERSION_NOT_FOUND(FileDomains.FILE, "0007", "إصدار الملف غير موجود"),
    COUNTER_NOT_FOUND(FileDomains.FILE, "0008", "file counter not found {0}"),
    FILE_DELETE_FAILED(FileDomains.FILE,"0009", "file Delete Failed {0}"),
    FILE_ALREADY_USED(FileDomains.FILE, "0010", "file already used {0}"),
    FIDS_NOT_FOUND(FileDomains.FILE, "0011", "fids {0} not found"),
    INVALID_FID(FileDomains.FILE, "0012", "invalid fid {0}"),;

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
