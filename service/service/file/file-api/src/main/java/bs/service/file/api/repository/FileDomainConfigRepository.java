package bs.service.file.api.repository;

import bs.service.file.model.entity.FlDomainConfig;

import java.util.Optional;

public interface FileDomainConfigRepository {
    Optional<FlDomainConfig> selectById(Integer id);

}
