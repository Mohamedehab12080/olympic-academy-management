package bs.service.file.api.service.utils;

public interface FileIdGeneratorService {
    String generate(Integer domainId);

    String generate(String fid, Integer version);
    String extractFId(String versionId);
}
