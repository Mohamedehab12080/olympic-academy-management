package bs.service.trainee.scheduler;

import bs.service.trainee.api.service.TraineeService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class EntityCleanupScheduler {

    private final TraineeService traineeService;

    @Scheduled(fixedRateString = "#{${bs.service.trainee-mgt.trainee-cleanup-scheduler-interval-in-min:15} * 60 * 1000}")
    @Transactional
    public void cleanupDeletedEntities() {
        traineeService.traineeCleanupScheduler();
    }
}
