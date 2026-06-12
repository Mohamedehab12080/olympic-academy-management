package bs.service.file.api.service;

import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.generated.UploadFileVTO;
import bs.service.file.model.helpers.FileInfo;

import java.util.List;

public interface FileVersionService {
    UploadFileVTO uploadNewVersion(String fid, FileInfo fileInfo);
    List<FileVTO> getAllVersions(String fid);

}
