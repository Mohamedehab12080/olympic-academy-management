package bs.service.file.core.mapper;

import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.file.model.config.AbstractFileConfig;
import bs.service.file.model.entity.FlDomainConfig;
import bs.service.file.model.entity.FlFile;
import bs.service.file.model.entity.FlFileVersion;
import bs.service.file.model.enums.FileErrors;
import bs.service.file.model.event.data.DomainEventData;
import bs.service.file.model.event.data.FileEventData;
import bs.service.file.model.event.data.FileVersionEventData;
import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.helpers.FileInfo;

import java.io.IOException;
import java.nio.file.Paths;

@Mapper(componentModel = "spring", injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public abstract class FileMapper {

    @Autowired
    private AbstractFileConfig fileConfig;

    @Mapping(target = "domain", source = "file.domain")
    @Mapping(target = "lastVersion", source = "version")
    @Mapping(target = "fid",source = "fidVersion")
    public abstract FileVTO toFileVTO(FlFileVersion version);

    public abstract LookupVTO toLookupVTO(FlDomainConfig domain);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "extension", source = "fileInfo.extension")
    @Mapping(target = "domain", source = "domain")
    @Mapping(target = "fid", source = "fid")
    @Mapping(target = "entityId", ignore = true)
    @Mapping(target = "lastVersion", constant = "1")
    @Mapping(target = "createdOn", expression = "java(java.time.LocalDateTime.now())")
    public abstract FlFile toFlFile(FileInfo fileInfo, FlDomainConfig domain, String fid);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "file", source = "flFile")
    @Mapping(target = "version", source = "version")
    @Mapping(target = "size", source = "fileInfo.size")
    @Mapping(target = "originalFilename", source = "fileInfo.originalFilename")
    @Mapping(target = "fidVersion", source = "fidVersion")
    @Mapping(target = "serverLocation", expression = "java(generateServerLocation(flFile))")
    @Mapping(target = "serverFileName", expression = "java(generateServerFileName(flFile, fidVersion))")
    public abstract FlFileVersion toFlFileVersion(FileInfo fileInfo, FlFile flFile, Integer version, String fidVersion);

    public String generateServerLocation(FlFile file) {
        FlDomainConfig domain = file.getDomain();
        String domainFolder = domain.getBaseFolder();
        return Paths.get(domainFolder).toString();
    }

    public String generateServerFileName(FlFile file, String fidVersion) {
        return file.getDomain().getLabel() + "-" + fidVersion + "." + file.getExtension();
    }

    @Mapping(target = "domain", source = "file.domain")
    public abstract FileEventData toFileEventData(FlFile file);

    @Mapping(target = "file", source = "fileVersion.file")
    public abstract FileVersionEventData toFileVersionEventData(FlFileVersion fileVersion);

    public abstract DomainEventData toDomainEventData(FlDomainConfig domain);

    public FileInfo toFileInfo(MultipartFile multipartFile) {
        // Validate input first
        if (multipartFile == null) {
            throw new BusinessException(FileErrors.FILE_UPLOAD_FAILED, "File cannot be null");
        }

        if (multipartFile.isEmpty()) {
            throw new BusinessException(FileErrors.FILE_UPLOAD_FAILED, "File cannot be empty");
        }

        String originalFilename = multipartFile.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new BusinessException(FileErrors.FILE_UPLOAD_FAILED, "Filename cannot be null or empty");
        }

        String extension = originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase()
                : "";

        byte[] content;
        try {
            content = multipartFile.getBytes();
        } catch (IOException e) {
            throw new BusinessException(FileErrors.FILE_UPLOAD_FAILED, "Failed to read file content", e);
        }

        if (content.length == 0) {
            throw new BusinessException(FileErrors.FILE_UPLOAD_FAILED, "File content is empty");
        }

        return FileInfo.builder().originalFilename(originalFilename).extension(extension)
                .size(multipartFile.getSize()).contentType(multipartFile.getContentType()).content(content)
                .build();
    }
}
