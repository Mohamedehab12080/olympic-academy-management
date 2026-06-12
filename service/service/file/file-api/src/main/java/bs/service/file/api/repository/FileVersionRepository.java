package bs.service.file.api.repository;


import bs.service.file.model.entity.FlFileVersion;
import bs.service.file.model.filter.FileVersionSearchFilter;

import java.util.List;
import java.util.Optional;

public interface FileVersionRepository {
    FlFileVersion insert(FlFileVersion flFileVersion);
    void delete(Integer flFileVersionId);
    void deleteAll(List<FlFileVersion> versions);
    List<FlFileVersion> selectAllByFilters(FileVersionSearchFilter filter);
}
