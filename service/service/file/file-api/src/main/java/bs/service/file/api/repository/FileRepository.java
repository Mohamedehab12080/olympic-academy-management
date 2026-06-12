package bs.service.file.api.repository;

import bs.service.file.model.entity.FlFile;
import bs.service.file.model.filter.FileSearchFilter;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface FileRepository {
    FlFile insert(FlFile flFile);
    FlFile update(FlFile flFile);
    Optional<FlFile> selectByFId(String fileFId);
    void deleteById(Long flFileId);
    List<FlFile> selectAllByFilters(FileSearchFilter filters);
    void deleteAll(List<FlFile> files);
}
