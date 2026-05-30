// user-module/src/main/java/com/fawry/user/core/controller/SuperAdminControllerImpl.java
package bs.service.user.controller;

import bs.olympic.common.security.api.service.SecurityUtilsService;
import bs.service.user.api.service.UserService;
import bs.service.user.core.controller.api.SuperAdminController;
import bs.service.user.model.dto.RegisterUserDTO;
import bs.service.user.model.dto.UpdateAdminDTO;
import bs.service.user.model.vto.UserDetailsVTO;
import bs.service.user.model.vto.UserVTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Slf4j
@RestController
@RequiredArgsConstructor
public class SuperAdminControllerImpl implements SuperAdminController {

    private final UserService userService;
    private final SecurityUtilsService securityUtilsService;

    @Override
    @Secured("ROLE_SUPER_ADMIN")
    public ResponseEntity<UserVTO> createAdmin(RegisterUserDTO request) {
        log.info("POST /api/super-admin/admins - Super Admin {} creating new admin with email: {}",
                securityUtilsService.getCurrentUserEmail(), request.getEmail());
        UserVTO createdAdmin = userService.createAdmin(request);
        return new ResponseEntity<>(createdAdmin, HttpStatus.CREATED);
    }

    @Override
    @Secured("ROLE_SUPER_ADMIN")
    public ResponseEntity<Void> updateAdmin(Long adminId, UpdateAdminDTO request) {
        log.info("PUT /api/super-admin/admins/{} - Super Admin {} updating admin",
                adminId, securityUtilsService.getCurrentUserEmail());
        userService.updateAdmin(adminId, request);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured("ROLE_SUPER_ADMIN")
    public ResponseEntity<Void> activateAdmin(Long adminId) {
        log.info("PUT /api/super-admin/admins/{}/activate - Super Admin {} activating admin",
                adminId, securityUtilsService.getCurrentUserEmail());
        userService.activateUser(adminId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured("ROLE_SUPER_ADMIN")
    public ResponseEntity<Void> deactivateAdmin(Long adminId) {
        log.info("PUT /api/super-admin/admins/{}/deactivate - Super Admin {} deactivating admin",
                adminId, securityUtilsService.getCurrentUserEmail());
        userService.deactivateUser(adminId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured("ROLE_SUPER_ADMIN")
    public ResponseEntity<List<UserDetailsVTO>> getAllAdmins() {
        log.info("GET /api/super-admin/admins - Super Admin {} viewing all admins",
                securityUtilsService.getCurrentUserEmail());
        List<UserDetailsVTO> admins = userService.getUsersByRole("ROLE_ADMIN");
        return ResponseEntity.ok(admins);
    }

    @Override
    @Secured("ROLE_SUPER_ADMIN")
    public ResponseEntity<UserDetailsVTO> getAdminById(Long id) {
        log.info("GET /api/super-admin/admins/{} - Super Admin {} viewing admin details",
                id, securityUtilsService.getCurrentUserEmail());
        UserDetailsVTO user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }
}
