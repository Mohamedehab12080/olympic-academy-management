package bs.service.financial.api.repository;

import bs.service.financial.model.entity.place.RentType;
import bs.service.financial.model.filter.RentTypeSearchFilter;

import java.util.List;
import java.util.Optional;

public interface RentTypeRepository {
    RentType insert(RentType rentType);
    RentType update(RentType rentType);
    Optional<RentType> selectById(Integer id);
    List<RentType> selectAllByFilters(RentTypeSearchFilter filters);
    Integer countAllByFilters(RentTypeSearchFilter filters);
}