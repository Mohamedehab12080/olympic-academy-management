package bs.service.file.core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import bs.lib.common.model.exception.BusinessException;

import bs.service.file.api.service.FileDomainConfigService;
import bs.service.file.model.entity.FlDomainConfig;
import bs.service.file.model.enums.FileErrors;
import bs.service.file.model.helpers.FileInfo;

import static bs.lib.service.context.model.enums.ServiceContextErrors.DOMAIN_NOT_FOUND;
import static bs.service.file.model.enums.FileErrors.EXCEED_MAX_SIZE;

@Service

@RequiredArgsConstructor
public class FileDomainConfigServiceImpl implements FileDomainConfigService {
    @Override
    public void validateFile(FlDomainConfig domain, FileInfo fileInfo) {
        if (domain == null || fileInfo == null)
            throw new BusinessException(DOMAIN_NOT_FOUND);

        if (!domain.getAllowedExtensionsSet().contains(fileInfo.getExtension()))
            throw new BusinessException(FileErrors.NOT_ALLOWED_EXTENSION);

        if (!(fileInfo.getSize() <= domain.getMaxSize()))
            throw new BusinessException(EXCEED_MAX_SIZE);
    }
}
