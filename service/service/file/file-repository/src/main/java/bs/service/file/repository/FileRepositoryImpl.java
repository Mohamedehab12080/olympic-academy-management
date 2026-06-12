package bs.service.file.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.lib.session.api.service.RequestContext;
import bs.lib.session.model.enums.CommonRequestContextKeys;
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
    private final RequestContext context;
    private final FileQueryBuilder queryBuilder;

    @Override
    public FlFile insert(FlFile flFile) {
        Long currentId=context.get(CommonRequestContextKeys.USER_ID, Long.class);
        flFile.setCreatedOn(LocalDateTime.now());
        flFile.setCreatedById(currentId);
        return jpaRepository.save(flFile);
    }

    @Override
    public FlFile update(FlFile flFile) {
        Long currentId=context.get(CommonRequestContextKeys.USER_ID, Long.class);
        flFile.setLastModifiedById(currentId);
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
