package bs.lib.security.model.exception;


import bs.lib.common.model.exception.AppException;
import bs.lib.common.model.interfaces.Errors;
import lombok.Getter;

@Getter
public class AuthorizationException extends AppException {

    public AuthorizationException(Errors error) {
        super(error);
    }

    public AuthorizationException(Errors error, Object... args) {
        super(error, args);
    }
}
