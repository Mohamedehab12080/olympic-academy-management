package bs.service.file.model.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class AbstractFileConfig {
    private String rootBaseUrl;
    private Integer fileCleanupSchedulerIntervalInMin;
}
