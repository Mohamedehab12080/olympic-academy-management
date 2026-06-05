package bs.service.place.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.place.api.repository.PlaceRepository;
import bs.service.place.model.entity.Place;
import bs.service.place.model.filter.PlaceSearchFilter;
import bs.service.place.repository.jpa.PlaceJPARepository;
import bs.service.place.repository.query.PlaceQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class PlaceRepositoryImpl implements PlaceRepository {

    private final PlaceJPARepository placeJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final PlaceQueryBuilder queryBuilder;

    @Override
    public Place insert(Place place) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        place.setCreatedBy(currentUser);
        place.setCreatedOn(LocalDateTime.now());
        place.setIsDeleted(false);
        return placeJPARepository.save(place);
    }

    @Override
    public Place update(Place place) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        place.setLastModifiedBy(currentUser);
        place.setLastModifiedOn(LocalDateTime.now());
        return placeJPARepository.save(place);
    }

    @Override
    public Optional<Place> selectById(Integer id) {
        return placeJPARepository.findById(id);
    }

    @Override
    public List<Place> selectAllByFilters(PlaceSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(PlaceSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public List<Place> selectAll() {
        return placeJPARepository.findAll();
    }
}