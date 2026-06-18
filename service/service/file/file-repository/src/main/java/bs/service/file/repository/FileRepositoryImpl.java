package bs.service.file.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.user.model.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.service.file.api.repository.FileRepository;
import bs.service.file.model.entity.FlFile;
import bs.service.file.model.filter.FileSearchFilter;
import bs.service.file.repository.jpa.FileJPARepository;
import bs.service.file.repository.query.FileQueryBuilder;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FileRepositoryImpl implements FileRepository {

    private final FileJPARepository jpaRepository;
    private final SecurityUtilsService securityUtilsService;
    private final FileQueryBuilder queryBuilder;

    @Override
    public FlFile insert(FlFile flFile) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        flFile.setCreatedOn(LocalDateTime.now());
        flFile.setCreatedBy(currentUser);
        return jpaRepository.save(flFile);
    }

    @Override
    public FlFile update(FlFile flFile) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        flFile.setLastModifiedBy(currentUser);
        flFile.setLastModifiedOn(LocalDateTime.now());
        return jpaRepository.save(flFile);
    }

    @Override
    public Optional<FlFile> selectByFId(String fileFId) {
        return jpaRepository.findByFid(fileFId);
    }

    @Override
    public List<FlFile> selectAllByFilters(FileSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public void deleteAll(List<FlFile> files) {
        jpaRepository.deleteAll(files);
    }

    @Override
    public void deleteById(Long flFileId) {
        jpaRepository.deleteById(flFileId);
    }


}
