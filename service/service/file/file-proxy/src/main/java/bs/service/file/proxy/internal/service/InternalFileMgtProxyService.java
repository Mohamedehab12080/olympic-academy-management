package bs.service.file.proxy.internal.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import bs.service.file.api.service.FileService;
import bs.service.file.proxy.service.FileMgtProxyService;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InternalFileMgtProxyService implements FileMgtProxyService {

    private final FileService fileService;

    @Override
    public void updateFileUsage(Integer domainId, String entityId, List<String> fids) {
        fileService.updateFileUsage(domainId, entityId, fids);
    }

    @Override
    public void deleteAllByFids(List<String> fids) {

    }
}
