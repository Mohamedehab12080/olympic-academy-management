package bs.service.user.core.scheduler;

import bs.service.user.api.repository.TokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Slf4j
@Component
@EnableScheduling
@RequiredArgsConstructor
public class TokenCleanupScheduler {

    private final TokenRepository tokenRepository;

    @Value("${token.cleanup.enabled:true}")
    private boolean enabled;

    @Scheduled(fixedRateString = "${token.cleanup.fixed-rate:3600000}")
    @Transactional
    public void cleanupExpiredTokens() {
        if (!enabled) {
            return;
        }

        log.info("Starting token cleanup scheduler at: {}", LocalDateTime.now());

        try {
            int deletedCount = tokenRepository.deleteByExpiryDateBefore(LocalDateTime.now());

            if (deletedCount > 0) {
                log.info("Token cleanup completed. Deleted {} expired tokens", deletedCount);
            }
        } catch (Exception e) {
            log.error("Error during token cleanup: {}", e.getMessage(), e);
        }
    }
}
