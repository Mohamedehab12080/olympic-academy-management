package bs.service.file.repository;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.service.file.api.repository.FileDomainConfigRepository;
import bs.service.file.model.entity.FlDomainConfig;
import bs.service.file.repository.jpa.FileDomainConfigJPARepository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class FileDomainConfigRepositoryImpl implements FileDomainConfigRepository {

    private final FileDomainConfigJPARepository jpaRepository;

    @Override
    public Optional<FlDomainConfig> selectById(Integer id) {
        return jpaRepository.findById(id);
    }


}
