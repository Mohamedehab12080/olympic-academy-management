package bs.service.file.annotation.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import bs.service.file.model.config.AbstractFileConfig;

@Data
@Configuration
@ConfigurationProperties(prefix = "bs.service.file-mgt")
@PropertySource("classpath:config/service/file-mgt.properties")
public class FileConfig extends AbstractFileConfig {

}
