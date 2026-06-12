package bs.lib.service.context.api.repository;

import bs.lib.service.context.model.entity.SCDomain;
import bs.lib.service.context.model.filter.DomainSearchFilter;

import java.util.List;
import java.util.Optional;

public interface DomainRepository {

    Optional<SCDomain> selectById(Integer id);

    List<SCDomain> selectAllByFilters(DomainSearchFilter searchFilter);

    Integer countAllByFilters(DomainSearchFilter searchFilter);
}