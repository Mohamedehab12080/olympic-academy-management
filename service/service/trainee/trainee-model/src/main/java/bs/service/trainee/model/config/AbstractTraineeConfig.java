package bs.service.trainee.model.config;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
@Data
@AllArgsConstructor
@NoArgsConstructor
public abstract class AbstractTraineeConfig {
    private Integer traineeCleanupSchedulerIntervalInMin;
}
