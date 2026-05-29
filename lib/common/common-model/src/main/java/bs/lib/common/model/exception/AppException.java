package bs.lib.common.model.exception;

import lombok.Getter;
import bs.lib.common.model.interfaces.Errors;

import java.text.MessageFormat;

@Getter
public abstract class AppException extends RuntimeException {
    private final Errors error;
    private final Object[] args;

    public AppException(Errors error) {
        super(error.getFullMessage());
        this.error = error;
        this.args = new Object[]{};
    }

    public AppException(Errors error, Object... args) {
        super(MessageFormat.format(error.getFullMessage(), args));
        this.error = error;
        this.args = args;
    }

    public AppException(Throwable cause, Errors error, Object... args) {
        super(MessageFormat.format(error.getFullMessage(), args), cause);
        this.error = error;
        this.args = args;
    }
}
