package bs.service.file.controller;

import lombok.AllArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import bs.service.file.api.service.FileService;
import bs.service.file.controller.config.SecurityAPIScopes;
import bs.service.file.controller.generated.FileController;
import bs.service.file.core.mapper.FileMapper;
import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.generated.UploadFileVTO;
import bs.service.file.model.helpers.FileInfo;

@RestController
@AllArgsConstructor
public class FileControllerImpl implements FileController {
    private final FileService fileService;
    private final FileMapper mapper;

    @Override
//    @Secured(value = {SecurityAPIScopes.SC_DOWNLOAD_FILE})
    public ResponseEntity<Resource> _downloadFile(String fid) {
        FileInfo fileInfo = fileService.downloadFile(fid);

        MediaType contentType = MediaTypeFactory.getMediaType(fileInfo.getOriginalFilename())
                .orElse(MediaType.APPLICATION_OCTET_STREAM);

        ByteArrayResource resource = new ByteArrayResource(fileInfo.getContent());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + fileInfo.getOriginalFilename() + "\"")
                .contentType(contentType)
                .contentLength(fileInfo.getContent().length)
                .body(resource);
    }

    @Override
    @Secured(value = {SecurityAPIScopes.SC_READ_FILE})
    public ResponseEntity<FileVTO> _getFileMetadata(String fid) {
        FileVTO fileVTO = fileService.getFileByFID(fid);
        return ResponseEntity.ok(fileVTO);
    }

    @Override
    @Secured(value = {SecurityAPIScopes.SC_UPLOAD_FILE})
    public ResponseEntity<UploadFileVTO> _uploadFile(Integer domainId, MultipartFile file) {
        FileInfo fileInfo = mapper.toFileInfo(file);
        return ResponseEntity.ok(fileService.uploadFile(fileInfo, domainId));
    }

    @Override
    @Secured(value = {SecurityAPIScopes.SC_DELETE_FILE})
    public ResponseEntity<Void> _deleteFile(String fid) {
        fileService.deleteByFid(fid);
        return ResponseEntity.noContent().build();
    }

}
