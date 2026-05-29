package bs.olympic.common.security.api.service;

import org.springframework.security.core.Authentication;
import java.util.Date;

public interface JwtService {
    String generateToken(Authentication authentication);
    String generateToken(String email, String role);
    String getEmailFromToken(String token);
    String getRoleFromToken(String token);
    Date extractExpiration(String token) ;
    boolean validateToken(String token);
}
