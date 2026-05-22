package bs.olympic.user.core.controller;

import bs.olympic.user.api.service.UserService;
import bs.olympic.user.core.controller.api.AuthController;
import bs.olympic.user.model.dto.LoginUserDTO;
import bs.olympic.user.model.dto.RegisterUserDTO;
import bs.olympic.user.model.vto.LoginUserVTO;
import bs.olympic.user.model.vto.RegisterUserVTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class AuthControllerImpl implements AuthController {

    private final UserService userService;

    @Override
    public ResponseEntity<RegisterUserVTO> register(RegisterUserDTO request) {
        log.info("POST /api/auth/register - Registering new user with email: {}", request.getEmail());
        RegisterUserVTO response = userService.register(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @Override
    public ResponseEntity<LoginUserVTO> login(LoginUserDTO request) {
        log.info("POST /api/auth/login - Login attempt for email: {}", request.getEmail());
        LoginUserVTO response = userService.login(request);
        return ResponseEntity.ok(response);
    }

    @Override
    public ResponseEntity<Void> logout() {
        log.info("POST /api/auth/logout - User logged out");
        return ResponseEntity.noContent().build();
    }
}