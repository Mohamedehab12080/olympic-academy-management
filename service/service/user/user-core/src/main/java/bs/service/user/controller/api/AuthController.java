// user-module/src/main/java/com/fawry/user/core/controller/api/AuthController.java
package bs.service.user.controller.api;

import bs.lib.common.model.vto.ErrorVTO;
import bs.service.user.model.dto.LoginUserDTO;
import bs.service.user.model.dto.RegisterUserDTO;
import bs.service.user.model.vto.LoginUserVTO;
import bs.service.user.model.vto.RegisterUserVTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Authentication", description = "Endpoints for user authentication")
@RequestMapping("/auth")
public interface AuthController {

    @PostMapping("/register")
    @Operation(summary = "Register new user", description = "Creates a new user account")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created"),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<RegisterUserVTO> register(@Valid @RequestBody RegisterUserDTO request);

    @PostMapping("/login")
    @Operation(summary = "Login user", description = "Authenticates user and returns JWT token")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok"),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<LoginUserVTO> login(@Valid @RequestBody LoginUserDTO request);

    @PostMapping("/logout")
    @Operation(summary = "Logout user", description = "Logs out the current user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No Content"),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<Void> logout();
}
