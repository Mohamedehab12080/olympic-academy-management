package bs.service.user.model.vto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterUserVTO {
    private Long id;
    private String email;
    private String fullName;
    private String role;
    private String message;
    private boolean activationRequired;
    private String activationEmailSent;
}
