package bs.service.department.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

import static bs.service.department.model.enums.DepartmentDomains.DEPARTMENT;

@AllArgsConstructor
public enum DepartmentErrors implements Errors {

    DEPARTMENT_NOT_FOUND(DEPARTMENT, "0001","القسم غير موجود {0}"),
    DEPARTMENT_ALREADY_EXIST(DEPARTMENT, "0002","القسم موجود بالفعل {0}"),
    ;

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
