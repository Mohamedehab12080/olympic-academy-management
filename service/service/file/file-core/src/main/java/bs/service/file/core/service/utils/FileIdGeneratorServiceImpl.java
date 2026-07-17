package bs.service.file.core.service.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bs.service.file.api.service.DailyCounterService;
import bs.service.file.api.service.utils.FileIdGeneratorService;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
@Transactional
@RequiredArgsConstructor
public class FileIdGeneratorServiceImpl implements FileIdGeneratorService {
    public static final int FILE_FID_LENGTH = 15;
    public static final int FILE_VER_FID_LENGTH = 18;

    public static final String FILE_FID_REGEX = "\\d{" + FILE_FID_LENGTH + "}";
    public static final String FILE_VER_FID_REGEX = "\\d{" + FILE_VER_FID_LENGTH + "}";

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("yyMMdd");

    private final DailyCounterService dailyCounterService;

    /**
     * Generate FID with format:
     * domainId(4 digits) + date(yyMMdd - 6 digits) + counter(5 digits) + version(3 digits)
     */
    private String generateFID(Integer domainId, Integer version) {
        if (domainId == null || version == null) {
            throw new IllegalArgumentException("domainId and version must not be null");
        }

        String dateString = LocalDate.now().format(DATE_FORMAT);
        int nextValue = dailyCounterService.getNewCount();

        return String.format("%04d%6s%05d%03d", domainId, dateString, nextValue, version);
    }

    @Override
    public String generate(Integer domainId) {
        return this.generateFID(domainId, 1);
    }

    @Override
    public String generate(String fid, Integer version) {
        String versionFid= String.format("%15s%03d",fid,version);
        return versionFid;
    }

    @Override
    public String extractFId(String versionId) {
        if (versionId == null || !versionId.matches(FILE_VER_FID_REGEX)) {
            throw new IllegalArgumentException("Version ID must be exactly " + FILE_VER_FID_LENGTH + " digits "+versionId);
        }
        return versionId.substring(0, FILE_FID_LENGTH);
    }
}
