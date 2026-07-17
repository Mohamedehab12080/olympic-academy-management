package bs.service.enrollment.scheduler;

import bs.service.enrollment.api.service.EnrollmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
public class EnrollmentUpdateScheduler {

    private final EnrollmentService enrollmentService;

    @Scheduled(cron = "0 0 0 * * *", zone = "Africa/Cairo")
    @Transactional
    public void updateEnrollment() {
        enrollmentService.updateEnrollmentsActivation();
    }
}
