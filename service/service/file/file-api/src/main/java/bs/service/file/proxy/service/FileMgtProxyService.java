package bs.service.file.proxy.service;

import java.util.List;

public interface FileMgtProxyService {
    void updateFileUsage(Integer domainId,String entityId,List<String> fids);
    void deleteAllByFids(List<String> fids);
}
