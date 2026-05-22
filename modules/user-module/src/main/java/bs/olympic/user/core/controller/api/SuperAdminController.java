package bs.olympic.user.core.controller.api;

import bs.olympic.common.model.vto.ErrorVTO;
import bs.olympic.user.model.dto.RegisterUserDTO;
import bs.olympic.user.model.dto.UpdateAdminDTO;
import bs.olympic.user.model.vto.UserDetailsVTO;
import bs.olympic.user.model.vto.UserVTO;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Super Admin Management", description = "Super Admin endpoints for managing admin users")
@RequestMapping("/api/super-admin")
public interface SuperAdminController {

    @PostMapping("/admins")
    @Operation(summary = "Create new admin", description = "Creates a new admin user (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Created", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = UserVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<UserVTO> createAdmin(@Valid @RequestBody RegisterUserDTO request);

    @PutMapping("/admins/{adminId}")
    @Operation(summary = "Update admin", description = "Update admin user (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<Void> updateAdmin(@PathVariable Long adminId, @Valid @RequestBody UpdateAdminDTO request);

    @PutMapping("/admins/{adminId}/activate")
    @Operation(summary = "Activate admin", description = "Activate admin user (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<Void> activateAdmin(@PathVariable Long adminId);

    @PutMapping("/admins/{adminId}/deactivate")
    @Operation(summary = "Deactivate admin", description = "Deactivate admin user (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "No content"),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<Void> deactivateAdmin(@PathVariable Long adminId);

    @GetMapping("/admins")
    @Operation(summary = "Get all admins", description = "Returns all admin users (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = UserDetailsVTO.class)))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<List<UserDetailsVTO>> getAllAdmins();

    @GetMapping("/admins/{id}")
    @Operation(summary = "Get admin by ID", description = "Returns admin details by ID (Super Admin only)")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Ok", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = UserDetailsVTO.class))
            }),
            @ApiResponse(responseCode = "400", description = "Bad Request", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "401", description = "Unauthorized", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            }),
            @ApiResponse(responseCode = "403", description = "Forbidden", content = {
                    @Content(mediaType = "application/json", schema = @Schema(implementation = ErrorVTO.class))
            })
    })
    ResponseEntity<UserDetailsVTO> getAdminById(@PathVariable Long id);
}