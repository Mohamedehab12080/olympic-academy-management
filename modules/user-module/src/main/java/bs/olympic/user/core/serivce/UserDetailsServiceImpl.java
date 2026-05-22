// user-module/src/main/java/com/fawry/user/config/UserDetailsServiceImpl.java
package bs.olympic.user.core.serivce;

import bs.olympic.common.model.exception.BusinessException;
import bs.olympic.common.security.model.CustomUserDetails;
import bs.olympic.user.api.repository.UserRepository;
import bs.olympic.user.model.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import static bs.olympic.user.model.enums.UserErrors.USER_NOT_FOUND;

@Slf4j
@Service("userDetailsService")
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.info("Loading user by email: {}", email);

        User user = userRepository.selectByEmail(email)
                .orElseThrow(() -> new BusinessException(USER_NOT_FOUND, email));

        log.info("User role from database: {}", user.getRole().name());  // Should print: ROLE_ADMIN

        return CustomUserDetails.builder()
                .id(user.getId())
                .email(user.getEmail())
                .password(user.getPassword())
                .role(user.getRole().name())
                .build();
    }
}