package bs.service.file.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import bs.service.file.api.service.DailyCounterService;

@Component
@RequiredArgsConstructor

public class DailyCounterResetScheduler {

    private final DailyCounterService dailyCounterService;

    @Scheduled(cron = "0 0 0 * * ?") // Run at midnight every day
    public void resetCounterAtMidnight() {
            dailyCounterService.resetCounter();
    }
}
