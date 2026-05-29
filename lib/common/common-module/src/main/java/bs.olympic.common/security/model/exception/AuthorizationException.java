package bs.olympic.common.security.model.exception;


import bs.olympic.common.model.exception.AppException;
import bs.olympic.common.model.interfaces.Errors;
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
