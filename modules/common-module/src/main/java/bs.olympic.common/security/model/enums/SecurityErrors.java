package bs.olympic.common.security.model.enums;

import bs.olympic.common.model.interfaces.Domains;
import bs.olympic.common.model.interfaces.Errors;
import lombok.AllArgsConstructor;

import static bs.olympic.common.security.model.enums.SecurityDomains.JWT_TOKEN;

@AllArgsConstructor
public enum SecurityErrors implements Errors {
    USER_NOT_FOUND(JWT_TOKEN, "0001", "User {0} not Found"),
    MISSING_TOKEN(JWT_TOKEN, "0002", "Missing or Non Bearer Authorization Token in the Request"),
    MISSING_USERNAME(JWT_TOKEN, "0003", "Missing username in the JWT Token"),
    INVALID_TOKEN(JWT_TOKEN, "0004", "Invalid Authorization Token provided"),
    NOT_AUTHENTICATED(JWT_TOKEN, "0005", "Not Authenticated");

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
