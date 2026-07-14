package bs.service.place.api.service;

import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.place.model.generated.PlaceDTO;
import bs.service.place.model.generated.PlaceResultSet;
import bs.service.place.model.generated.PlaceVTO;

import java.time.LocalDate;

public interface PlaceService {
    NewRecordVTO createPlace(PlaceDTO placeDTO);
    NewRecordVTO updatePlace(Integer placeId, PlaceDTO placeDTO);
    void deletePlaceById(Integer placeId);
    PlaceVTO getPlaceById(Integer placeId, LocalDate createdOnFrom,LocalDate createdOnTo);
    PlaceResultSet getAllPlacesByFilter(String quickSearch, Integer pageNum, Integer pageSize,
                                        OrderDirections orderDir, String orderBy);
    LookupResultSet getAllPlacesLookup();
}