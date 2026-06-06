package bs.lib.security.core.error;

import bs.lib.security.model.exception.AuthenticationException;
import bs.lib.security.model.exception.AuthorizationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.exception.InternalServerException;
import bs.lib.common.model.vto.ErrorVTO;
import bs.lib.rest.model.enums.RESTErrors;

import static org.springframework.http.HttpStatus.*;

@Log4j2
@ControllerAdvice
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RESTGlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorVTO> handleBusinessException(BusinessException _ex, WebRequest request) {
        ErrorVTO error = _ex.getArgs() != null ? ErrorVTO.of(_ex.getError(), _ex.getArgs()) : ErrorVTO.of(_ex.getError());
        log.error("{}: {}", _ex.getClass().getSimpleName(), _ex.getMessage());
        return ResponseEntity.status(BAD_REQUEST).body(error);
    }

    @ExceptionHandler(InternalServerException.class)
    public ResponseEntity<ErrorVTO> handleInternalServerException(InternalServerException _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), _ex.getMessage());
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(ErrorVTO.of(RESTErrors.INTERNAL_SERVER_ERROR));
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorVTO> handleAuthenticationException(AuthenticationException _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), _ex.getMessage());
        return ResponseEntity.status(UNAUTHORIZED).body(ErrorVTO.of(RESTErrors.UN_AUTHENTICATED_REQ));
    }

    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<ErrorVTO> handleAuthorizationException(AuthorizationException _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), _ex.getMessage());
        return ResponseEntity.status(FORBIDDEN).body(ErrorVTO.of(RESTErrors.UN_AUTHORIZED_REQ));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorVTO> handleMethodArgumentNotValidException(MethodArgumentNotValidException _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), RESTErrors.INVALID_REQUEST.getFullMessage(), _ex);
        return ResponseEntity.status(BAD_REQUEST).body(ErrorVTO.of(RESTErrors.INVALID_REQUEST));
    }

    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<ErrorVTO> handleAccessDeniedException(AccessDeniedException _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), RESTErrors.UN_AUTHORIZED_REQ.getFullMessage(), _ex);
        return ResponseEntity.status(FORBIDDEN).body(ErrorVTO.of(RESTErrors.UN_AUTHORIZED_REQ));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorVTO> handleException(Exception _ex, WebRequest request) {
        log.error("{}: {}", _ex.getClass().getSimpleName(), RESTErrors.INTERNAL_SERVER_ERROR.getFullMessage(), _ex);
        return ResponseEntity.status(INTERNAL_SERVER_ERROR).body(ErrorVTO.of(RESTErrors.INTERNAL_SERVER_ERROR));
    }
}
