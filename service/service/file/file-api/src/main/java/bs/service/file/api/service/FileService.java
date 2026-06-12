package bs.service.file.api.service;

import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.generated.UploadFileVTO;
import bs.service.file.model.helpers.FileInfo;

import java.util.List;

public interface FileService {
    UploadFileVTO uploadFile(FileInfo file, Integer domainId);
    FileInfo downloadFile(String fid);
    void updateFileUsage(Integer domainId, String entityId, List<String> fids);
    FileVTO getFileByFID(String fid);
    void deleteByFid(String fid);
    void cleanUpOrphanFiles();
    void deleteAllByFids(List<String> fids);
}
