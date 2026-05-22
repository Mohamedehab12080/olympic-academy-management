package bs.olympic.user.api.service;

import bs.olympic.user.model.dto.*;
import bs.olympic.user.model.vto.LoginUserVTO;
import bs.olympic.user.model.vto.RegisterUserVTO;
import bs.olympic.user.model.vto.UserDetailsVTO;
import bs.olympic.user.model.vto.UserVTO;

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
