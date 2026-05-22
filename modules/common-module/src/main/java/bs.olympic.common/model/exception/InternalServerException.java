package bs.olympic.common.model.exception;

import bs.olympic.common.model.interfaces.Errors;
import lombok.Getter;

@Getter
public class InternalServerException extends AppException {

    public InternalServerException(Errors error) {
        super(error);
    }

    public InternalServerException(Errors error, Object... args) {
        super(error, args);
    }
}
