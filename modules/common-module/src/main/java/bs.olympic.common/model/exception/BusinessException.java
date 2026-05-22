package bs.olympic.common.model.exception;

import bs.olympic.common.model.interfaces.Errors;
import lombok.Getter;

@Getter
public class BusinessException extends AppException {

    public BusinessException(Errors error) {
        super(error);
    }

    public BusinessException(Errors error, Object... args) {
        super(error, args);
    }

    public BusinessException(Throwable cause, Errors error, Object... args) {
        super(error, cause, args);
    }

    public BusinessException(InternalServerException intEx, Errors error) {
        super(intEx, error);
    }

    public BusinessException(InternalServerException intEx, Errors error, Object... args) {
        super(intEx, error, args);
    }

    public BusinessException(InternalServerException intEx, Throwable cause, Errors error, Object... args) {
        super(intEx, error, cause, args);
    }

}
