package bs.lib.service.context.api.repository;

import bs.lib.service.context.model.entity.SCEvent;
import bs.lib.service.context.model.filter.EventSearchFilter;

import java.util.List;
import java.util.Optional;

public interface EventRepository {

    Optional<SCEvent> selectById(Integer id);

    List<SCEvent> selectAllByFilters(EventSearchFilter searchFilter);

    Integer countAllByFilters(EventSearchFilter searchFilter);
}