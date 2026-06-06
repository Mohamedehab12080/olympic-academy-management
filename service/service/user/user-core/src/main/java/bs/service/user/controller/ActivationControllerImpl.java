package bs.service.user.controller;

import bs.service.user.api.service.UserService;
import bs.service.user.controller.api.ActivationController;
import bs.service.user.model.dto.ForgotPasswordRequestDTO;
import bs.service.user.model.dto.ResetPasswordDTO;
import bs.service.user.model.util.ActivationVTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequiredArgsConstructor
public class ActivationControllerImpl implements ActivationController {

    private final UserService userService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ActivationVTO> activateAccount(String token) {
        log.info("GET /auth/activate - Activating account with token");

        userService.activateUser(token);

        ActivationVTO response = ActivationVTO.builder()
                .success(true)
                .message("Account activated successfully. You can now login.")
                .redirectUrl("/login")
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ActivationVTO> verifyActivateAccount(String token) {
        log.info("GET /auth/activate/verify - Verify activate token");

        userService.verifyActivationToken(token);

        ActivationVTO response = ActivationVTO.builder()
                .success(true)
                .message("Verified successfully")
                .redirectUrl("")
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ActivationVTO> resetPasswordActivate(String token) {
        userService.resetPasswordVerification(token);
        ActivationVTO response = ActivationVTO.builder()
                .success(true)
                .message("Verified successfully. You can now reset your password.")
                .redirectUrl("/reset-password")
                .build();
        return ResponseEntity.ok(response);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ActivationVTO> resendActivationEmail(String email) {
        log.info("POST /auth/resend-activation - Resending activation email to: {}", email);

        userService.resendActivationEmail(email);

        ActivationVTO response = ActivationVTO.builder()
                .success(true)
                .message("Activation email sent successfully. Please check your inbox.")
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ActivationVTO> forgotPassword(ForgotPasswordRequestDTO request) {
        log.info("POST /auth/forgot-password - Forgot password for email: {}", request.getEmail());

        userService.forgotPassword(request);

        ActivationVTO response = ActivationVTO.builder()
                .success(true)
                .message("Password reset email sent successfully. Please check your inbox.")
                .build();

        return ResponseEntity.ok(response);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ActivationVTO> resetPassword(ResetPasswordDTO request) {
        log.info("POST /auth/reset-password - Resetting password");

        userService.resetPassword(request);

        ActivationVTO response = ActivationVTO.builder()
                .success(true)
                .message("Password reset successfully. You can now login with your new password.")
                .redirectUrl("/login")
                .build();

        return ResponseEntity.ok(response);
    }
}
