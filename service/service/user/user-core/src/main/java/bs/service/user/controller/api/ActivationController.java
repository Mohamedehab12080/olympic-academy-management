package bs.service.user.controller.api;


import bs.olympic.common.model.vto.ErrorVTO;
import bs.olympic.user.model.dto.ForgotPasswordRequestDTO;
import bs.olympic.user.model.dto.ResetPasswordDTO;
import bs.olympic.user.util.ActivationVTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Account Activation", description = "Endpoints for user account activation and password reset")
@RequestMapping("/api/auth")
public interface ActivationController {

    @GetMapping("/activate")
    @Operation(summary = "Activate user account", description = "Activates user account using the token from email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ActivationVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<ActivationVTO> activateAccount(@RequestParam String token);

        @GetMapping("/activate/verify")
        @Operation(summary = "Verify user activation token", description = "Verify user activation token from email")
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Ok", content = {
                        @Content(mediaType = "application/json", schema = @Schema(implementation = ActivationVTO.class))
                }),
                @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                        @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
                })
        })
        ResponseEntity<ActivationVTO> verifyActivateAccount(@RequestParam String token);


    @GetMapping("/reset-verify")
    @Operation(summary = "Reset password for user account", description = "Reset password for account using the token from email")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ActivationVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<ActivationVTO> resetPasswordActivate(@RequestParam String token);

    @PostMapping("/resend-activation")
    @Operation(summary = "Resend activation email", description = "Resends activation email to user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ActivationVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<ActivationVTO> resendActivationEmail(@RequestParam String email);

    @PostMapping("/forgot-password")
    @Operation(summary = "Forgot password", description = "Sends password reset email to user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ActivationVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<ActivationVTO> forgotPassword(@Valid @RequestBody ForgotPasswordRequestDTO request);

    @PostMapping("/reset-password")
    @Operation(summary = "Reset password", description = "Resets user password using token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ActivationVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<ActivationVTO> resetPassword(@Valid @RequestBody ResetPasswordDTO request);
}
