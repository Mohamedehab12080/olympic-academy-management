package bs.service.file.api.service;

import bs.service.file.model.entity.FlDomainConfig;
import bs.service.file.model.helpers.FileInfo;

public interface FileDomainConfigService {
    void validateFile(FlDomainConfig domain, FileInfo fileInfo);
}


