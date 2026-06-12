package bs.service.file.proxy.internal;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import bs.service.file.api.service.FileService;
import bs.service.file.proxy.service.FileMgtProxyService;

import java.util.List;

@Service

@AllArgsConstructor
public class FileMgtProxyInternalServiceImpl implements FileMgtProxyService {

    private final FileService fileService;

    @Override
    public void updateFileUsage(Integer domainId, String entityId, List<String> fids) {
        fileService.updateFileUsage(domainId, entityId, fids);
    }

    @Override
    public void deleteAllByFids(List<String> fids) {
        fileService.deleteAllByFids(fids);
    }
}
