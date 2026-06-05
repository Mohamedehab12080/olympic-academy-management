package bs.service.place.api.repository;

import bs.service.place.model.entity.Place;
import bs.service.place.model.filter.PlaceSearchFilter;

import java.util.List;
import java.util.Optional;

public interface PlaceRepository {
    Place insert(Place place);
    Place update(Place place);
    Optional<Place> selectById(Integer id);
    List<Place> selectAllByFilters(PlaceSearchFilter filters);
    Integer countAllByFilters(PlaceSearchFilter filters);
    List<Place> selectAll();
}