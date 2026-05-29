package bs.olympic.common.security.model.exception;


import bs.olympic.common.model.exception.AppException;
import bs.olympic.common.model.interfaces.Errors;
import lombok.Getter;

@Getter
public class AuthenticationException extends AppException {

    public AuthenticationException(Errors error) {
        super(error);
    }

    public AuthenticationException(Errors error, Object... args) {
        super(error, args);
    }
}
