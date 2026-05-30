package bs.lib.security.annotation.imports;

import io.jsonwebtoken.security.Keys;
import lombok.AllArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import bs.lib.security.annotation.config.SecurityAdapterConfig;
import bs.lib.security.core.service.JWTServiceImpl;
import bs.lib.security.model.config.AbstractSecurityAdapterConfig;

import javax.crypto.SecretKey;
import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportSecurityUtilities.Root.class})
public @interface ImportSecurityUtilities {

    @AllArgsConstructor
    @Import(value = {JWTServiceImpl.class, SecurityAdapterConfig.class})
    class Root {
        private final AbstractSecurityAdapterConfig securityAdapterConfig;

        @Bean
        public SecretKey jwtTokenSecretKey() throws Exception {
//        final String HASHING_ALGORITHM = "HmacSHA256";
//        KeyGenerator keyGen = KeyGenerator.getInstance(HASHING_ALGORITHM);
//        SecretKey sk = keyGen.generateKey();
//        return Keys.hmacShaKeyFor(sk.getEncoded());
            String salt = securityAdapterConfig.getJwtSalt();
            return Keys.hmacShaKeyFor(salt.getBytes());
        }

    }
}
