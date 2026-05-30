package bs.service.user.api.service;

import bs.service.user.model.dto.*;
import bs.service.user.model.vto.LoginUserVTO;
import bs.service.user.model.vto.RegisterUserVTO;
import bs.service.user.model.vto.UserDetailsVTO;
import bs.service.user.model.vto.UserVTO;

import java.util.List;

public interface UserService {
    RegisterUserVTO register(RegisterUserDTO request);
    LoginUserVTO login(LoginUserDTO request);
    UserDetailsVTO getUserByEmail(String email);
    UserDetailsVTO getUserById(Long id);
    List<UserVTO> getAllUsers();
    boolean existsByEmail(String email);
    UserVTO createAdmin(RegisterUserDTO request);
    void activateUser(Long userId);
    void deactivateUser(Long userId);
    void updateAdmin(Long adminId,UpdateAdminDTO request);
    List<UserDetailsVTO> getUsersByRole(String role);
    void activateUser(String token);
    void resendActivationEmail(String email);
    void forgotPassword(ForgotPasswordRequestDTO forgotPasswordRequestDTO);
    void resetPassword(ResetPasswordDTO request);
    void resetPasswordVerification(String token);
    void verifyActivationToken(String token);
}
