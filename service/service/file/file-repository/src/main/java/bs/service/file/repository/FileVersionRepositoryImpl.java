package bs.service.file.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.user.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import bs.service.file.api.repository.FileVersionRepository;
import bs.service.file.model.entity.FlFileVersion;
import bs.service.file.model.filter.FileVersionSearchFilter;
import bs.service.file.repository.jpa.FileJPAVersionRepository;
import bs.service.file.repository.query.FileVersionQueryBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class FileVersionRepositoryImpl implements FileVersionRepository {

    private final FileJPAVersionRepository versionRepository;
    private final SecurityUtilsService securityUtilsService;
    private final FileVersionQueryBuilder fileVersionQueryBuilder;

    @Override
    @Transactional
    public FlFileVersion insert(FlFileVersion flFileVersion) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        flFileVersion.setCreatedBy(currentUser);
        flFileVersion.setCreatedOn(LocalDateTime.now());
        return versionRepository.save(flFileVersion);
    }
    
    @Override
    public void delete(Integer flFileVersionId) {
        versionRepository.deleteById(flFileVersionId);
    }

    @Override
    public void deleteAll(List<FlFileVersion> versions) {
        versionRepository.deleteAll(versions);
    }

    @Override
    public List<FlFileVersion> selectAllByFilters(FileVersionSearchFilter filter) {
        return fileVersionQueryBuilder.selectAllByFilters(filter);
    }

}
