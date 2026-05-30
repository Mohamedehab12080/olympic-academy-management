package bs.lib.security.model.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Base64;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class AbstractSecurityAdapterConfig {
    private List<String> publicPaths;
    private String jwtSalt;
    private Long expirationTimeInHours;
    private InternalMSRESTConfig internalMS;

    public String getInternalRESTBasicToken() {
        String decodedToken = this.getInternalMS().getUsername() + ":" + this.getInternalMS().getPassword();
        return Base64.getEncoder().encodeToString(decodedToken.getBytes());
    }
}
