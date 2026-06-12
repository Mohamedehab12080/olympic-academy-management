package bs.service.file.controller;

import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import bs.service.file.api.service.FileVersionService;
import bs.service.file.controller.config.SecurityAPIScopes;
import bs.service.file.controller.generated.FileVersionController;
import bs.service.file.core.mapper.FileMapper;
import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.generated.UploadFileVTO;
import bs.service.file.model.helpers.FileInfo;

import java.util.List;

@RestController
@AllArgsConstructor
public class FileVersionControllerImpl implements FileVersionController {
    private final FileVersionService fileVersionService;
    private final FileMapper mapper;

    @Override
    @Secured(value = {SecurityAPIScopes.SC_READ_ALL_FILE_VERSIONS})
    public ResponseEntity<List<FileVTO>> _getAllVersions(String fid) {
        List<FileVTO> versions = fileVersionService.getAllVersions(fid);
        return ResponseEntity.ok(versions);
    }

    @Override
    @Secured(value = {SecurityAPIScopes.SC_UPLOAD_FILE_VERSION})
    public ResponseEntity<UploadFileVTO> _uploadNewVersion(String fid, MultipartFile file) {
        FileInfo fileInfo = mapper.toFileInfo(file);
        return ResponseEntity.ok(fileVersionService.uploadNewVersion(fid, fileInfo));
    }
}
