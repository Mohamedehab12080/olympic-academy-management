package bs.service.file.core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import bs.lib.common.model.exception.BusinessException;


import bs.lib.sql.db.adapter.model.old.PaginationInfo;
import bs.service.file.api.repository.FileDomainConfigRepository;
import bs.service.file.api.repository.FileRepository;
import bs.service.file.api.repository.FileVersionRepository;
import bs.service.file.api.service.FileDomainConfigService;
import bs.service.file.api.service.FileService;
import bs.service.file.api.service.utils.StorageService;
import bs.service.file.core.mapper.FileMapper;
import bs.service.file.core.service.utils.FileIdGeneratorServiceImpl;
import bs.service.file.model.config.AbstractFileConfig;
import bs.service.file.model.entity.FlDomainConfig;
import bs.service.file.model.entity.FlFile;
import bs.service.file.model.entity.FlFileVersion;
import bs.service.file.model.enums.FileErrors;
import bs.service.file.model.filter.FileSearchFilter;
import bs.service.file.model.filter.FileVersionSearchFilter;
import bs.service.file.model.generated.FileVTO;
import bs.service.file.model.generated.UploadFileVTO;
import bs.service.file.model.helpers.FileInfo;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

import static bs.lib.service.context.model.enums.ServiceContextErrors.DOMAIN_NOT_FOUND;
import static bs.service.file.core.service.utils.FileIdGeneratorServiceImpl.*;


@Service

@RequiredArgsConstructor
public class FileServiceImpl implements FileService {

    private final FileRepository fileRepository;
    private final FileVersionRepository fileVersionRepository;
    private final FileDomainConfigRepository domainRepository;
    private final FileIdGeneratorServiceImpl fileIdGeneratorService;
    private final FileMapper fileMapper;
    private final StorageService storageService;
    private final FileDomainConfigService domainService;
    private final AbstractFileConfig abstractFileConfig;

    @Override
    @Transactional
    public UploadFileVTO uploadFile(FileInfo fileInfo, Integer domainId) {
        FlDomainConfig domain = domainRepository.selectById(domainId)
                .orElseThrow(() -> new BusinessException(DOMAIN_NOT_FOUND, domainId));

        domainService.validateFile(domain, fileInfo);

        String fidVersion = fileIdGeneratorService.generate(domainId);
        String fid=fileIdGeneratorService.extractFId(fidVersion);

        FlFile flFile = fileMapper.toFlFile(fileInfo, domain,fid);
        flFile.setLastVersion(1);

        FlFileVersion fileVersion = fileMapper.toFlFileVersion(fileInfo, flFile, 1, fidVersion);

        flFile = fileRepository.insert(flFile);
        fileVersion.setFile(flFile);
        fileVersionRepository.insert(fileVersion);

        Path locationPath = Paths.get(abstractFileConfig.getRootBaseUrl(), flFile.getDomain().getBaseFolder());
        storageService.write(locationPath.toString(), fileVersion.getServerFileName(), fileInfo.getContent());

        return new UploadFileVTO(fid);
    }

    @Override
    public FileInfo downloadFile(String fid) {
        FlFileVersion fileVersion;
        FileVersionSearchFilter fileVersionSearchFilter;
        if (fid.matches(FILE_FID_REGEX)) {
            fileVersionSearchFilter=FileVersionSearchFilter.builder()
                    .fids(List.of(fid))
                    .pagination(PaginationInfo.builder().pageSize(1).build()).build();
        } else {
            fileVersionSearchFilter=FileVersionSearchFilter.builder()
                    .fidVersions(List.of(fid))
                    .pagination(PaginationInfo.builder().pageSize(1).build()).build();
        }
        List<FlFileVersion> fileVersions=fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);
        if(fileVersions.size()!=1){
            throw new BusinessException(FileErrors.FILE_VERSION_NOT_FOUND,fid);
        }
        fileVersion = fileVersions.get(0);
        String filePath = Paths.get(abstractFileConfig.getRootBaseUrl(), fileVersion.getServerLocation(),
                fileVersion.getServerFileName()).toString();
        byte[] fileData = storageService.read(filePath);

        FileInfo fileInfo= FileInfo.builder().extension(fileVersion.getFile().getExtension()).content(fileData)
                .originalFilename(fileVersion.getOriginalFilename()).build();
        return fileInfo;
    }


    @Override
    @Transactional
    public void updateFileUsage(Integer domainId, String entityId, List<String> fids) {

        FileSearchFilter domainIdAndEntityIdFilter=FileSearchFilter.builder()
                .domainId(domainId)
                .entityId(entityId)
                .pagination(PaginationInfo.noPagination()).build();
        List<FlFile> existingFilteredFiles=fileRepository.selectAllByFilters(domainIdAndEntityIdFilter);

        Set<String> targetFidSet = new HashSet<>(fids);

        FileSearchFilter fidsFilter=FileSearchFilter.builder()
                .fids(fids)
                .pagination(PaginationInfo.noPagination()).build();

        List<FlFile> targetFiles = fileRepository.selectAllByFilters(fidsFilter);

        if (targetFiles.size() != targetFidSet.size()) {
            Set<String> foundFids = targetFiles.stream()
                    .map(FlFile::getFid)
                    .collect(Collectors.toSet());
            List<String> missingFids = targetFidSet.stream()
                    .filter(fid -> !foundFids.contains(fid))
                    .collect(Collectors.toList());
            throw new BusinessException(FileErrors.FIDS_NOT_FOUND, missingFids);
        }

        Map<String, FlFile> existingFileMap = existingFilteredFiles.stream()
                .collect(Collectors.toMap(FlFile::getFid, Function.identity()));

        Map<String, FlFile> targetFileMap = targetFiles.stream()
                .collect(Collectors.toMap(FlFile::getFid, Function.identity()));

        List<FlFile> filesToAssociate= targetFileMap.entrySet().stream()
                .filter(entry -> !existingFileMap.containsKey(entry.getKey()))
                .map(Map.Entry::getValue)
                .toList();

        filesToAssociate.forEach(file -> {
            file.setEntityId(entityId);
            fileRepository.update(file);
        });

        // Process files to disassociate (currently associated but not in target)
        List<FlFile> filesToDisassociate= existingFileMap.entrySet().stream()
                .filter(entry -> !targetFileMap.containsKey(entry.getKey()))
                .map(Map.Entry::getValue)
                .toList();

        filesToDisassociate.forEach(file -> {
            file.setEntityId(null);
            fileRepository.update(file);
        });
    }

    @Override
    public FileVTO getFileByFID(String fid) {
        FlFileVersion version = null;
        String versionFid=fid;
        if (fid.length() == FILE_FID_LENGTH) {
            FlFile file = fileRepository.selectByFId(fid)
                    .orElseThrow(() -> new BusinessException(FileErrors.FILE_NOT_FOUND));
            String fileVersion=String.format("%03d",file.getLastVersion());
            versionFid+=fileVersion;

        } else if (fid.length() == FILE_VER_FID_LENGTH) {
            versionFid=fid;
        }

        FileVersionSearchFilter fileVersionSearchFilter=FileVersionSearchFilter.builder()
                .fidVersions(List.of(versionFid))
                .pagination(PaginationInfo.builder().pageSize(1).build())
                .build();
        List<FlFileVersion> fileVersions=fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);
        if(fileVersions.size()!=1){
            throw new BusinessException(FileErrors.FILE_VERSION_NOT_FOUND,versionFid);
        }
        version = fileVersions.get(0);

        return fileMapper.toFileVTO(version);
    }

    @Override
    @Transactional
    public void cleanUpOrphanFiles() {
        LocalDateTime threshold = LocalDateTime.now().minusMinutes(abstractFileConfig.getFileCleanupSchedulerIntervalInMin());

        FileSearchFilter nullEntityIdFilter=FileSearchFilter.builder()
                .isEntityIdIsNull(true)
                .createdOnTo(threshold)
                .pagination(PaginationInfo.noPagination())
                .build();

        List<FlFile> existingFilteredFiles=fileRepository.selectAllByFilters(nullEntityIdFilter);

        if (existingFilteredFiles.isEmpty()) {
            return;
        }

        Set<Long> foundFileFids = existingFilteredFiles.stream()
                .map(FlFile::getId)
                .collect(Collectors.toSet());
        FileVersionSearchFilter fileVersionSearchFilter=FileVersionSearchFilter.builder()
                .fileIds(new ArrayList<>(foundFileFids))
                .pagination(PaginationInfo.noPagination()).build();
        List<FlFileVersion> versions = fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);

        for (FlFileVersion version : versions) {
            String filePath = Paths.get(abstractFileConfig.getRootBaseUrl(),
                    version.getServerLocation(),
                    version.getServerFileName()).toString();
            storageService.delete(filePath);
        }
        fileVersionRepository.deleteAll(versions);

        fileRepository.deleteAll(existingFilteredFiles);
    }

    @Override
    @Transactional
    public void deleteByFid(String fid) {
        if (fid.length() == FILE_VER_FID_LENGTH) {
            FileVersionSearchFilter fileVersionSearchFilter=FileVersionSearchFilter.builder()
                    .fidVersions(List.of(fid))
                    .pagination(PaginationInfo.builder().pageSize(1).build()).build();
            List<FlFileVersion> fileVersions=fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);
            if(fileVersions.size()!=1){
                throw new BusinessException(FileErrors.FILE_VERSION_NOT_FOUND,fid);
            }

            FlFileVersion fileVersion = fileVersions.get(0);

            String filePath = Paths.get(
                    abstractFileConfig.getRootBaseUrl(),
                    fileVersion.getServerLocation(),
                    fileVersion.getServerFileName()
            ).toString();
            storageService.delete(filePath);

            fileVersionRepository.delete(fileVersion.getId());

        } else if (fid.length() == FILE_FID_LENGTH) {
            FlFile file = fileRepository.selectByFId(fid)
                    .orElseThrow(() -> new BusinessException(FileErrors.FILE_NOT_FOUND, fid));
            FileVersionSearchFilter fileVersionSearchFilter=FileVersionSearchFilter.builder()
                    .fileIds(List.of(file.getId()))
                    .pagination(PaginationInfo.noPagination()).build();

            List<FlFileVersion> versions = fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);

            for (FlFileVersion version : versions) {
                String filePath = Paths.get(
                        abstractFileConfig.getRootBaseUrl(),
                        version.getServerLocation(),
                        version.getServerFileName()
                ).toString();
                storageService.delete(filePath);
            }
            fileVersionRepository.deleteAll(versions);
            fileRepository.deleteById(file.getId());

        } else {
            throw new BusinessException(FileErrors.INVALID_FID, fid);
        }
    }

    @Override
    @Transactional
    public void deleteAllByFids(List<String> fids) {
        if (fids == null || fids.isEmpty()) {
            return;
        }

        Set<String> fidSet = new HashSet<>(fids);

        Set<String> versionFids = fidSet.stream()
                .filter(fid -> fid != null && fid.length() == FILE_VER_FID_LENGTH)
                .collect(Collectors.toSet());

        Set<String> fileFids = new HashSet<>(fidSet);
        fileFids.removeAll(versionFids);

        FileVersionSearchFilter fileVersionSearchFilter=FileVersionSearchFilter.builder()
                .fidVersions(new ArrayList<>(versionFids))
                .pagination(PaginationInfo.noPagination()).build();

        List<FlFileVersion> fileVersions = fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);

        if (fileVersions.size() != versionFids.size()) {
            Set<String> foundVersionFids = fileVersions.stream()
                    .map(FlFileVersion::getFidVersion)
                    .collect(Collectors.toSet());
            Set<String> missingVersionFids = new HashSet<>(versionFids);
            missingVersionFids.removeAll(foundVersionFids);
            throw new BusinessException(FileErrors.FIDS_NOT_FOUND, new ArrayList<>(missingVersionFids));
        }

        Set<FlFileVersion> allVersions = new HashSet<>(fileVersions); // Prevent duplicates
        List<FlFile> files = new ArrayList<>();

        if (!fileFids.isEmpty()) {
            FileSearchFilter fileSearchFilter = FileSearchFilter.builder()
                    .fids(new ArrayList<>(fileFids))
                    .pagination(PaginationInfo.noPagination())
                    .build();
            files = fileRepository.selectAllByFilters(fileSearchFilter);

            if (files.size() != fileFids.size()) {
                Set<String> foundFileFids = files.stream()
                        .map(FlFile::getFid)
                        .collect(Collectors.toSet());
                Set<String> missingFileFids = new HashSet<>(fileFids);
                missingFileFids.removeAll(foundFileFids);
                throw new BusinessException(FileErrors.FIDS_NOT_FOUND, new ArrayList<>(missingFileFids));
            }

            List<Long> fileIds = files.stream()
                    .map(FlFile::getId)
                    .toList();

             fileVersionSearchFilter=FileVersionSearchFilter.builder()
                    .fileIds(fileIds)
                    .pagination(PaginationInfo.noPagination()).build();

            List<FlFileVersion> fileSpecificVersions = fileVersionRepository.selectAllByFilters(fileVersionSearchFilter);
            allVersions.addAll(fileSpecificVersions);
        }

        if (!allVersions.isEmpty()) {
            allVersions.stream()
                    .map(version -> Paths.get(
                            abstractFileConfig.getRootBaseUrl(),
                            version.getServerLocation(),
                            version.getServerFileName()
                    ).toString())
                    .parallel()
                    .forEach(storageService::delete);

            fileVersionRepository.deleteAll(new ArrayList<>(allVersions));
        }

        if (!files.isEmpty()) {
            fileRepository.deleteAll(files);
        }

    }

}

