package bs.service.file.core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bs.lib.common.model.exception.BusinessException;


import bs.lib.sql.db.adapter.model.old.PaginationInfo;
import bs.service.file.api.repository.FileRepository;
import bs.service.file.api.repository.FileVersionRepository;
import bs.service.file.api.service.FileDomainConfigService;
import bs.service.file.api.service.FileVersionService;
import bs.service.file.api.service.utils.FileIdGeneratorService;
import bs.service.file.api.service.utils.StorageService;
import bs.service.file.core.mapper.FileMapper;
import bs.service.file.model.config.AbstractFileConfig;
import bs.service.file.model.entity.FlFile;
import bs.service.file.model.entity.FlFileVersion;
import bs.service.file.model.event.data.FileVersionEventData;
import bs.service.file.model.filter.FileVersionSearchFilter;
import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.generated.UploadFileVTO;
import bs.service.file.model.helpers.FileInfo;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;

import static bs.service.file.model.enums.FileErrors.FILE_NOT_FOUND;
import static bs.service.file.model.enums.FileEvents.UPLOAD_FILE;

@Service

@RequiredArgsConstructor
public class FileVersionServiceImpl implements FileVersionService {

    private final FileRepository fileRepository;
    private final FileVersionRepository fileVersionRepository;
    private final FileDomainConfigService domainService;
    private final FileIdGeneratorService fileIdGeneratorService;
    private final FileMapper fileMapper;
    private final StorageService storageService;
    private final AbstractFileConfig abstractFileConfig;
    private final MQClientService mqClientService;

    @Override
    @Transactional
    public UploadFileVTO uploadNewVersion(String fid, FileInfo fileInfo) {
        FlFile originalFile = fileRepository.selectByFId(fid)
                .orElseThrow(() -> new BusinessException(FILE_NOT_FOUND));
        domainService.validateFile(originalFile.getDomain(), fileInfo);
        Integer nextVersion = originalFile.getLastVersion() + 1;
        String versionFid = fileIdGeneratorService.generate(originalFile.getFid(), nextVersion);

        FlFileVersion newVersion = fileMapper.toFlFileVersion(fileInfo, originalFile, nextVersion, versionFid);
        FlFileVersion savedVersion = fileVersionRepository.insert(newVersion);


        originalFile.setLastVersion(nextVersion);
        fileRepository.update(originalFile);

        Path storagePath = Paths.get(abstractFileConfig.getRootBaseUrl(), originalFile.getDomain().getBaseFolder());
        storageService.write(storagePath.toString(), newVersion.getServerFileName(), fileInfo.getContent());

        FileVersionEventData eventData = fileMapper.toFileVersionEventData(savedVersion);
        mqClientService.sendMessage(UPLOAD_FILE, eventData);

        return new UploadFileVTO(versionFid);
    }


    @Override
    public List<FileVTO> getAllVersions(String fid) {
        FlFile file = fileRepository.selectByFId(fid).orElseThrow(() -> new BusinessException(FILE_NOT_FOUND));

        FileVersionSearchFilter fileVersionSearchFilter=FileVersionSearchFilter.builder()
                .fileIds(List.of(file.getId()))
                .pagination(PaginationInfo.noPagination())
                .build();

        List<FlFileVersion> versions = fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);

        if (versions.isEmpty())
            return List.of();

        List<FileVTO> versionVTOs = versions.stream()
                .map(fileMapper::toFileVTO)
                .collect(Collectors.toList());

        return versionVTOs;
    }
}
