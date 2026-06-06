package bs.lib.rest.core.error;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.apache.tomcat.websocket.AuthenticationException;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authorization.AuthorityAuthorizationDecision;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import bs.lib.common.model.exception.AppException;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.exception.InternalServerException;
import bs.lib.common.model.vto.ErrorVTO;
import bs.lib.rest.model.enums.RESTErrors;

import java.util.List;

import static org.springframework.http.HttpStatus.*;

@Log4j2
@ControllerAdvice
@RequiredArgsConstructor
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RESTGlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorVTO> handleBusinessException(BusinessException _ex, WebRequest request) {
        ErrorVTO error = _ex.getArgs() != null ? ErrorVTO.of(_ex.getError(), _ex.getArgs()) : ErrorVTO.of(_ex.getError());

        StringBuilder errorLog = new StringBuilder();
        errorLog.append(_ex.getClass().getSimpleName()).append(": ").append(_ex.getMessage());

        Throwable _cause = _ex.getCause();

        while (_cause instanceof AppException appEx) {
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

    @ExceptionHandler({AuthenticationException.class, AuthorizationDeniedException.class})
    public ResponseEntity<ErrorVTO> handleAuthenticationException(Exception _ex, WebRequest request) {
        if (_ex instanceof AuthorizationDeniedException ex) {
            AuthorityAuthorizationDecision decision = (AuthorityAuthorizationDecision) ex.getAuthorizationResult();
            List<String> scopeIds = decision.getAuthorities().stream().map(GrantedAuthority::getAuthority).toList();
            log.error("{}: Access Denied for Scopes: {}", _ex.getClass().getSimpleName(), scopeIds);
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

}
