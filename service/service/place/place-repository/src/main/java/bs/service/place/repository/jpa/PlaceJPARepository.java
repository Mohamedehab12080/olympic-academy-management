package bs.service.place.repository.jpa;

import bs.service.place.model.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PlaceJPARepository extends JpaRepository<Place, Integer> {
}