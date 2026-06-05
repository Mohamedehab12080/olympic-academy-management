package bs.service.place.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.place.model.entity.Place;
import bs.service.place.model.generated.PlaceDTO;
import bs.service.place.model.generated.PlaceListItem;
import bs.service.place.model.generated.PlaceVTO;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class PlaceMapper {


    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(Place place);

    public abstract List<LookupVTO> toLookupVTOs(List<Place> places);

    // ==================== Place Mappings ====================

    public abstract Place toPlace(PlaceDTO placeDTO);

    public abstract PlaceVTO toPlaceVTO(Place place);

    public abstract PlaceListItem toPlaceListItem(Place place);

    public abstract List<PlaceListItem> toPlaceListItems(List<Place> places);
}