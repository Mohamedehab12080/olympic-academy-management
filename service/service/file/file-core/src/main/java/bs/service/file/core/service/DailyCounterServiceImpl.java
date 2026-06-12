package bs.service.file.core.service;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bs.lib.common.model.exception.BusinessException;
import bs.service.file.api.repository.DailyCounterRepository;
import bs.service.file.api.service.DailyCounterService;
import bs.service.file.model.entity.FlDailyCounter;
import bs.service.file.model.enums.FileErrors;

import java.time.LocalDate;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

@Service
@RequiredArgsConstructor
public class DailyCounterServiceImpl implements DailyCounterService {

    public static final Integer COUNTER_ID = 1;
    private final AtomicInteger counter = new AtomicInteger(0);
    private final DailyCounterRepository dailyCounterRepository;
    private FlDailyCounter flDailyCounter;

    @PostConstruct
    protected void initializeCounter() {
        Optional<FlDailyCounter> counterOpt = dailyCounterRepository.selectById(COUNTER_ID);
        LocalDate today = LocalDate.now();

        if (counterOpt.isPresent()) {
            this.flDailyCounter = counterOpt.get();
            if (this.flDailyCounter.getLastModifiedOn().isBefore(today)) {
                this.flDailyCounter.setCount(0);
                this.flDailyCounter.setLastModifiedOn(today);
                dailyCounterRepository.update(this.flDailyCounter);
                counter.set(0);
            } else {
                counter.set(this.flDailyCounter.getCount());
            }
        } else {
            throw new BusinessException(FileErrors.COUNTER_NOT_FOUND, COUNTER_ID);
        }
    }

    @Override
    @Transactional
    public int getNewCount() {
        int newValue = counter.incrementAndGet();
        this.flDailyCounter.setCount(newValue);
        this.flDailyCounter.setLastModifiedOn(LocalDate.now());
        dailyCounterRepository.update(this.flDailyCounter);
        return newValue;
    }

    @Override
    @Transactional
    public void resetCounter() {
        counter.set(0);
        this.flDailyCounter.setCount(0);
        this.flDailyCounter.setLastModifiedOn(LocalDate.now());
        dailyCounterRepository.update(this.flDailyCounter);
    }
}
