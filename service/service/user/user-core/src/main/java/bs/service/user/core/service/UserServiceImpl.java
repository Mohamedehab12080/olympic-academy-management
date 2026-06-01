package bs.service.user.core.service;

import bs.lib.common.api.service.EmailService;
import bs.lib.common.model.dto.MailTemplateDTO;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.security.api.service.JwtService;
import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.user.api.repository.TokenRepository;
import bs.service.user.api.repository.UserRepository;
import bs.service.user.api.service.UserService;
import bs.service.user.core.mapper.UserMapper;
import bs.service.user.model.dto.*;
import bs.service.user.model.entity.Token;
import bs.service.user.model.entity.User;
import bs.service.user.model.enums.Role;
import bs.service.user.model.enums.TokenTypes;
import bs.service.user.model.util.TokenGenerator;
import bs.service.user.model.vto.LoginUserVTO;
import bs.service.user.model.vto.RegisterUserVTO;
import bs.service.user.model.vto.UserDetailsVTO;
import bs.service.user.model.vto.UserVTO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;

import static bs.service.user.model.enums.UserErrors.*;
import static bs.lib.security.model.config.SecurityConstants.TOKEN_EXPIRE_TIME;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final SecurityUtilsService securityUtilsService;
    private final TokenRepository tokenRepository;
    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.base.url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Override
    @Transactional
    public RegisterUserVTO register(RegisterUserDTO request) {
        log.info("Registering new user with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(USER_ALREADY_EXIST, request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setIsActive(false);
        user.setRole(Role.ROLE_USER);

        Integer currentUserId = securityUtilsService.getCurrentUserId();
        if (currentUserId != null) {
            user.setCreatedBy(User.builder().id(currentUserId).build());
        }

        User savedUser = userRepository.insert(user);

        // Generate activation token with expiry date
        String activationToken = TokenGenerator.generateToken();
        Token token = Token.builder()
                .token(activationToken)
                .user(savedUser)
                .tokenType(TokenTypes.ACTIVATION)
                .expiryDate(LocalDateTime.now().plusMinutes(TokenTypes.ACTIVATION.getExpirationTimeMinutes()))
                .build();
        tokenRepository.insert(token);

        // Send activation email
        sendActivationEmail(savedUser, activationToken);

        log.info("User registered successfully with id: {}, activation email sent, token expires at: {}",
                savedUser.getId(), token.getExpiryDate());

        RegisterUserVTO response = userMapper.toRegisterResponseVTO(savedUser);
        response.setActivationRequired(true);
        response.setActivationEmailSent(savedUser.getEmail());

        return response;
    }

    @Override
    public LoginUserVTO login(LoginUserDTO request) {
        try {
            log.info("Login attempt for email: {}", request.getEmail());

            User user = userRepository.selectByEmail(request.getEmail())
                    .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, request.getEmail()));

            if (Boolean.FALSE.equals(user.getIsActive())) {
                throw new BusinessException(USER_NOT_ACTIVE, user.getEmail());
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String token = jwtService.generateToken(authentication);

            return userMapper.toLoginUserVTO(user, TOKEN_EXPIRE_TIME, token);

        } catch (BadCredentialsException ex) {
            log.warn("Login failed - Invalid credentials for email: {}", request.getEmail());
            throw new BusinessException(INVALID_CREDENTIALS);
        }
    }

    @Override
    @Transactional
    public void activateUser(String token) {
        log.info("Activating user with token: {}", token);

        Token activationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(INVALID_ACTIVATION_TOKEN));

        if(!activationToken.getTokenType().equals(TokenTypes.ACTIVATION))
            throw new BusinessException(INVALID_ACTIVATION_TOKEN);

        if (activationToken.isUsed()) {
            throw new BusinessException(TOKEN_ALREADY_USED);
        }

        if (activationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException(TOKEN_EXPIRED);
        }

        User user = activationToken.getUser();
        if (user.getIsActive()) {
            throw new BusinessException(USER_ALREADY_ACTIVE, user.getId());
        }

        user.setIsActive(true);
        userRepository.update(user);

        log.info("User is just acttive ");

        activationToken.setUsed(true);
        tokenRepository.update(activationToken);

        log.info("User with id: {} activated successfully", user.getId());
    }

    @Override
    @Transactional
    public void verifyActivationToken(String token) {
        log.info("Activating user with token: {}", token);

        Token activationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(INVALID_ACTIVATION_TOKEN));

        if(!activationToken.getTokenType().equals(TokenTypes.ACTIVATION))
            throw new BusinessException(INVALID_ACTIVATION_TOKEN);

        if (activationToken.isUsed()) {
            throw new BusinessException(TOKEN_ALREADY_USED);
        }

        if (activationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException(TOKEN_EXPIRED);
        }

        User user = activationToken.getUser();
        if (user.getIsActive()) {
            throw new BusinessException(USER_ALREADY_ACTIVE, user.getId());
        }

        user.setIsActive(true);
        userRepository.update(user);

        log.info("User is just acttive ");

        activationToken.setUsed(true);
        tokenRepository.update(activationToken);

        log.info("User with id: {} activated successfully", user.getId());
    }

    @Override
    @Transactional
    public void resendActivationEmail(String email) {
        log.info("Resending activation email to: {}", email);

        User user = userRepository.selectByEmail(email)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, email));

        if (user.getIsActive()) {
            throw new BusinessException(USER_ALREADY_ACTIVE, user.getId());
        }

        tokenRepository.deleteByUserIdAndTokenType(user.getId(), TokenTypes.ACTIVATION);

        String activationToken = TokenGenerator.generateToken();
        Token token = Token.builder()
                .token(activationToken)
                .user(user)
                .tokenType(TokenTypes.ACTIVATION)
                .expiryDate(LocalDateTime.now().plusMinutes(TokenTypes.ACTIVATION.getExpirationTimeMinutes()))
                .build();
        tokenRepository.insert(token);

        sendActivationEmail(user, activationToken);

        log.info("Activation email resent successfully to: {}, new token expires at: {}", email, token.getExpiryDate());
    }

    @Override
    @Transactional
    public void forgotPassword(ForgotPasswordRequestDTO forgotPasswordRequestDTO) {
        log.info("Processing forgot password for email: {}", forgotPasswordRequestDTO.getEmail());

        User user = userRepository.selectByEmail(forgotPasswordRequestDTO.getEmail())
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, forgotPasswordRequestDTO.getEmail()));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new BusinessException(USER_NOT_ACTIVE, user.getEmail());
        }

        tokenRepository.deleteByUserIdAndTokenType(user.getId(), TokenTypes.PASSWORD_RESET);

        String resetToken = TokenGenerator.generateToken();
        Token token = Token.builder()
                .token(resetToken)
                .user(user)
                .tokenType(TokenTypes.PASSWORD_RESET)
                .expiryDate(LocalDateTime.now().plusMinutes(TokenTypes.PASSWORD_RESET.getExpirationTimeMinutes()))
                .build();
        tokenRepository.insert(token);

        sendPasswordResetEmail(user, resetToken);

        log.info("Password reset email sent successfully to: {}, token expires at: {}", forgotPasswordRequestDTO.getEmail(), token.getExpiryDate());
    }

    @Override
    @Transactional
    public void resetPassword(ResetPasswordDTO request) {
        log.info("Resetting password with token");

        Token resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new BusinessException(INVALID_RESET_PASSWORD_TOKEN));

        if (resetToken.isUsed()) {
            throw new BusinessException(TOKEN_ALREADY_USED);
        }

        if (resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException(TOKEN_EXPIRED);
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.update(user);

        resetToken.setUsed(true);
        tokenRepository.update(resetToken);

        log.info("Password reset successfully for user: {}", user.getEmail());
    }

    @Override
    public void resetPasswordVerification(String token) {
        log.info("Reset password user with token: {}", token);

        Token verificationToken = tokenRepository.findByToken(token)
                .orElseThrow(() -> new BusinessException(INVALID_ACTIVATION_TOKEN));

        if(!verificationToken.getTokenType().equals(TokenTypes.PASSWORD_RESET))
            throw new BusinessException(INVALID_RESET_PASSWORD_TOKEN);

        if (verificationToken.isUsed()) {
            throw new BusinessException(TOKEN_ALREADY_USED);
        }

        if (verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new BusinessException(TOKEN_EXPIRED);
        }
    }

    @Override
    public UserDetailsVTO getUserByEmail(String email) {
        User user = userRepository.selectByEmail(email)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, email));
        return userMapper.toUserDetailsVTO(user);
    }

    @Override
    public UserDetailsVTO getUserById(Integer id) {
        User user = userRepository.selectById(id)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, id));
        return userMapper.toUserDetailsVTO(user);
    }

    @Override
    public List<UserVTO> getAllUsers() {
        List<UserVTO> usersVTOs = userRepository.selectAll().stream()
                .map(userMapper::toUserVTO)
                .toList();
        return usersVTOs;
    }

    @Override
    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    @Override
    @Transactional
    public UserVTO createAdmin(RegisterUserDTO request) {
        log.info("Creating new admin with email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BusinessException(USER_ALREADY_EXIST, request.getEmail());
        }

        User user = userMapper.toEntity(request);
        user.setIsActive(true);
        user.setRole(Role.ROLE_ADMIN);

        Integer currentUserId = securityUtilsService.getCurrentUserId();
        if (currentUserId != null) {
            user.setCreatedBy(User.builder().id(currentUserId).build());
        }

        User savedUser = userRepository.insert(user);
        return userMapper.toUserVTO(savedUser);
    }

    @Override
    @Transactional
    public void activateUser(Integer userId) {
        log.info("Activate user with id: {}", userId);

        User user = userRepository.selectById(userId)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, userId));

        if (user.getIsActive().equals(Boolean.TRUE)) {
            throw new BusinessException(USER_ALREADY_ACTIVE, userId);
        }

        user.setIsActive(true);

        Integer currentUserId = securityUtilsService.getCurrentUserId();
        if (currentUserId != null) {
            user.setLastModifiedBy(User.builder().id(currentUserId).build());
        }

        userRepository.update(user);
        log.info("User with id: {} has been activated successfully", userId);
    }

    @Override
    @Transactional
    public void deactivateUser(Integer userId) {
        log.info("Deactivate user with id: {}", userId);

        User user = userRepository.selectById(userId)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, userId));

        if (user.getIsActive().equals(Boolean.FALSE)) {
            throw new BusinessException(USER_ALREADY_INACTIVE, userId);
        }

        user.setIsActive(false);

        Integer currentUserId = securityUtilsService.getCurrentUserId();
        if (currentUserId != null) {
            user.setLastModifiedBy(User.builder().id(currentUserId).build());
        }

        userRepository.update(user);
        log.info("User with id: {} has been deactivated successfully", userId);
    }

    @Override
    @Transactional
    public void updateAdmin(Integer adminId, UpdateAdminDTO request) {
        log.info("Updating admin with id: {}", adminId);

        User user = userRepository.selectById(adminId)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, adminId));

        user.setMobileNumber(request.getMobileNumber());

        Integer currentUserId = securityUtilsService.getCurrentUserId();
        if (currentUserId != null) {
            user.setLastModifiedBy(User.builder().id(currentUserId).build());
        }

        userRepository.update(user);
        log.info("Admin with id: {} has been updated successfully", adminId);
    }

    @Override
    public List<UserDetailsVTO> getUsersByRole(String role) {
        return userMapper.toUserDetailsVTOs(userRepository.selectByRole(Role.valueOf(role)));
    }

    // Private helper methods for sending emails
    private void sendActivationEmail(User user, String activationToken) {
        String activationUrl = "http://localhost:4200/auth/activate?token=" + activationToken+"&email="+user.getEmail();

        Context context = new Context();
        context.setVariable("fullName", user.getFullName());
        context.setVariable("activationUrl", activationUrl);
        context.setVariable("expiryHours", TokenTypes.ACTIVATION.getExpirationTimeMinutes() / 60);

        MailTemplateDTO mailTemplate = MailTemplateDTO.builder()
                .to(user.getEmail())
                .from(fromEmail)
                .subject("Activate Your Travel Planner Account")
                .templateName("activation-email")
                .context(context)
                .build();

        emailService.sendEmail(mailTemplate);
    }

    private void sendPasswordResetEmail(User user, String resetToken) {
//        String resetUrl = baseUrl + "/api/auth/reset-verify?token=" + resetToken;
        String resetLink = "http://localhost:4200/auth/reset-verify?token=" + resetToken;

        Context context = new Context();
        context.setVariable("fullName", user.getFullName());
        context.setVariable("resetUrl", resetLink);
        context.setVariable("expiryMinutes", TokenTypes.PASSWORD_RESET.getExpirationTimeMinutes());

        MailTemplateDTO mailTemplate = MailTemplateDTO.builder()
                .to(user.getEmail())
                .from(fromEmail)
                .subject("Reset Your Travel Planner Password")
                .templateName("reset-password-email")
                .context(context)
                .build();

        emailService.sendEmail(mailTemplate);
    }
}
