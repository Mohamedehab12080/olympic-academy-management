package bs.service.file.scheduler;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import bs.service.file.api.service.FileService;

@Component
@RequiredArgsConstructor
public class FileEntityIdCleanupScheduler {

    private final FileService fileService;

    @Scheduled(fixedRateString = "#{${bs.service.file-mgt.file-cleanup-scheduler-interval-in-min:15} * 60 * 1000}")
    @Transactional
    public void cleanupOrphanedFiles() {
        fileService.cleanUpOrphanFiles();
    }
}
