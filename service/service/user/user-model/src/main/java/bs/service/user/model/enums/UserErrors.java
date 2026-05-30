package bs.service.user.model.enums;

import bs.lib.common.model.interfaces.Domains;
import bs.lib.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

import static bs.service.user.model.enums.UserDomains.USER;


@AllArgsConstructor
public enum UserErrors implements Errors {
    USER_NOT_FOUND(USER,"0001","User {0} not found"),
    USER_ALREADY_EXIST(USER,"0002","User {0} already exist"),
    USER_ALREADY_ACTIVE(USER,"0003","User {0} already active"),
    USER_ALREADY_INACTIVE(USER,"0004","User {0} already inactive"),
    USER_NOT_ACTIVE(USER,"0005","User {0} not active"),
    INVALID_CREDENTIALS(USER,"0006","Invalid credentials"),
    INTERNAL_ERROR(USER,"0007","Internal error {0}"),
    INVALID_ACTIVATION_TOKEN(USER,"0008", "Invalid activation token"),
    TOKEN_ALREADY_USED(USER, "0009","Token already used"),
    TOKEN_EXPIRED(USER, "0010","Token has expired"),
    INVALID_RESET_PASSWORD_TOKEN(USER, "0011","Invalid reset password");


    private final Domains domain;
    private final String code;
    private final String messageEn;

    @Override
    public Domains domain() {
        return domain;
    }

    @Override
    public String code() {
        return code;
    }

    @Override
    public String messageEn() {
        return messageEn;
    }
}
