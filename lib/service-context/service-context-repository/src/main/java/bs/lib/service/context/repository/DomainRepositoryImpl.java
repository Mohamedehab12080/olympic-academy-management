package bs.lib.service.context.repository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;
import bs.lib.service.context.api.repository.DomainRepository;
import bs.lib.service.context.model.entity.SCDomain;
import bs.lib.service.context.model.filter.DomainSearchFilter;
import bs.lib.service.context.repository.jpa.DomainJPARepository;
import bs.lib.service.context.repository.query.DomainQueryBuilder;

import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class DomainRepositoryImpl implements DomainRepository {
    private final DomainJPARepository domainJPARepository;
    private final DomainQueryBuilder queryBuilder;

    @Override
    public Optional<SCDomain> selectById(Integer id) {
        return domainJPARepository.findById(id);
    }

    @Override
    public List<SCDomain> selectAllByFilters(DomainSearchFilter searchFilter) {
        return queryBuilder.selectAllByFilters(searchFilter);
    }

    @Override
    public Integer countAllByFilters(DomainSearchFilter searchFilter) {
        return queryBuilder.countAllByFilters(searchFilter);
    }
}