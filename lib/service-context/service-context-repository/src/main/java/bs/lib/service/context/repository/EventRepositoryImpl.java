package bs.lib.service.context.repository;

import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import bs.lib.service.context.api.repository.EventRepository;
import bs.lib.service.context.model.entity.SCEvent;
import bs.lib.service.context.model.filter.EventSearchFilter;
import bs.lib.service.context.repository.jpa.EventJPARepository;
import bs.lib.service.context.repository.query.EventQueryBuilder;

import java.util.List;
import java.util.Optional;

@Repository

@AllArgsConstructor
public class EventRepositoryImpl implements EventRepository {
    private final EventJPARepository eventJPARepository;
    private final EventQueryBuilder queryBuilder;

    @Override
    public Optional<SCEvent> selectById(Integer id) {
        return eventJPARepository.findById(id);
    }

    @Override
    public List<SCEvent> selectAllByFilters(EventSearchFilter searchFilter) {
        return queryBuilder.selectAllByFilters(searchFilter);
    }

    @Override
    public Integer countAllByFilters(EventSearchFilter searchFilter) {
        return queryBuilder.countAllByFilters(searchFilter);
    }
}