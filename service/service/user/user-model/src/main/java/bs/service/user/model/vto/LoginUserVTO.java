package bs.service.user.model.vto;

import bs.service.user.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginUserVTO {
    private String token;
    private Long userId;
    private String fullName;
    private String email;
    private Role role;
    private Long expiresIn;
}
