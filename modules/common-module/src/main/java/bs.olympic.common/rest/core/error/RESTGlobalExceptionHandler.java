package bs.olympic.common.rest.core.error;

import bs.olympic.common.model.exception.AppException;
import bs.olympic.common.model.exception.BusinessException;
import bs.olympic.common.model.exception.InternalServerException;
import bs.olympic.common.model.vto.ErrorVTO;
import bs.olympic.common.rest.model.enums.RESTErrors;
import lombok.extern.slf4j.Slf4j;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;

import static org.springframework.http.HttpStatus.*;

@Slf4j
@RestControllerAdvice
public class RESTGlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorVTO> handleBusinessException(BusinessException _ex, WebRequest request) {
        ErrorVTO error = _ex.getArgs() != null ? ErrorVTO.of(_ex.getError(), _ex.getArgs()) : ErrorVTO.of(_ex.getError());

        StringBuilder errorLog = new StringBuilder();
        errorLog.append(_ex.getClass().getSimpleName()).append(": ").append(_ex.getMessage());

        Throwable _cause = _ex.getCause();

        while (_cause != null && _cause instanceof AppException appEx) {
            errorLog
                    .append("\nCaused by ")
                    .append(appEx.getClass().getSimpleName())
                    .append(": ")
                    .append(appEx.getMessage());

            _cause = _cause.getCause();
        }

        log.error(errorLog.toString());
        return ResponseEntity.status(BAD_REQUEST).body(error);
    }


    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<ErrorVTO> handleInternalServerException(InternalServerException _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), _ex.getMessage());
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(ErrorVTO.of(RESTErrors.INTERNAL_SERVER_ERROR));
    }

    @ExceptionHandler({AuthenticationException.class, AccessDeniedException.class})
    public ResponseEntity<ErrorVTO> handleAuthenticationException(Exception _ex, WebRequest request) {
        if (_ex instanceof AccessDeniedException ex) {
            log.error("{}: Access Denied", _ex.getClass().getSimpleName());
        } else
            log.error("{}: {}", _ex.getClass().getSimpleName(), _ex.getMessage());
        return ResponseEntity.status(UNAUTHORIZED).body(ErrorVTO.of(RESTErrors.UN_AUTHORIZED_REQ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorVTO> handleMethodArgumentNotValidException(MethodArgumentNotValidException _ex, WebRequest request) {
        ErrorVTO errorVTO = ErrorVTO.of(RESTErrors.INVALID_REQUEST);
        errorVTO.setReqBodyErrors(_ex.getBindingResult().getFieldErrors().stream()
                .map(err -> "Rejected Value: " + err.getRejectedValue() + ", Field: " + err.getField() + ", " + err.getDefaultMessage())
                .toList());
        log.error("{}: {}", _ex.getClass().getSimpleName(), RESTErrors.INVALID_REQUEST.getFullMessage(), _ex);
        return ResponseEntity.status(BAD_REQUEST).body(errorVTO);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorVTO> handleException(Exception _ex, WebRequest request) {
        Throwable cause = _ex;
        BusinessException businessEx = null;

        while (cause != null) {
            if (cause instanceof BusinessException) {
                businessEx = (BusinessException) cause;
                break;
            }
            cause = cause.getCause();
        }

        if (businessEx != null) {
            ErrorVTO error = businessEx.getArgs() != null ?
                    ErrorVTO.of(businessEx.getError(), businessEx.getArgs()) :
                    ErrorVTO.of(businessEx.getError());
            log.error("{}: {}", _ex.getClass().getSimpleName(), RESTErrors.INTERNAL_SERVER_ERROR.getFullMessage(), _ex);
            return ResponseEntity.status(BAD_REQUEST).body(error);
        }
        log.error("{}: {}", _ex.getClass().getSimpleName(), RESTErrors.INTERNAL_SERVER_ERROR.getFullMessage(), _ex);
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(ErrorVTO.of(RESTErrors.INTERNAL_SERVER_ERROR));
    }

}