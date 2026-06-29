package bs.lib.security.annotation.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import bs.lib.security.model.config.AbstractSecurityAdapterConfig;

import java.util.Arrays;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "bs.lib.security")
@PropertySource(value = "classpath:config/library/security-adapter.properties")
public class SecurityAdapterConfig extends AbstractSecurityAdapterConfig {


}
