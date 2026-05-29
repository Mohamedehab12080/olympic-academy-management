package bs.lib.common.model.exception;

import lombok.Getter;
import bs.lib.common.model.interfaces.Errors;

@Getter
public class InternalServerException extends AppException {

    public InternalServerException(Errors error) {
        super(error);
    }

    public InternalServerException(Errors error, Object... args) {
        super(error, args);
    }
}
