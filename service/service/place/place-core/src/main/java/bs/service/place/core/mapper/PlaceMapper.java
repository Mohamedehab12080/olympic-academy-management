package bs.service.place.core.mapper;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.place.model.entity.Constant;
import bs.service.place.model.entity.Place;
import bs.service.place.model.generated.*;
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


    // ==================== Place Mappings ====================

    public abstract Constant toConstant(ConstantDTO constantDTO);

    public abstract ConstantVTO toConstantVTO(Constant constant);

    public abstract ConstantListItem toConstantListItem(Constant constant);

    public abstract List<ConstantListItem> toConstantListItems(List<Constant> constants);

    public abstract LookupVTO toConstantLookupVTO(Constant constant);
    public abstract List<LookupVTO> toConstantLookupVTOs(List<Constant> constants);
}