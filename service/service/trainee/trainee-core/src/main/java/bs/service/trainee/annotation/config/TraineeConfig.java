package bs.service.trainee.annotation.config;

import bs.service.trainee.model.config.AbstractTraineeConfig;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

@Data
@Configuration
@ConfigurationProperties(prefix = "bs.service.trainee-mgt")
@PropertySource("classpath:config/service/trainee-mgt.properties")
public class TraineeConfig extends AbstractTraineeConfig {

}
