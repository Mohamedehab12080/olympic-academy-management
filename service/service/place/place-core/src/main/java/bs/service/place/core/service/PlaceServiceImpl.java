package bs.service.place.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.place.api.repository.PlaceReportRepository;
import bs.service.place.api.repository.PlaceRepository;
import bs.service.place.api.service.PlaceService;
import bs.service.place.core.mapper.PlaceMapper;
import bs.service.place.model.entity.Place;
import bs.service.place.model.filter.PlaceSearchFilter;
import bs.service.place.model.generated.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.place.model.enums.PlaceErrors.PLACE_NOT_FOUND;
import static bs.service.place.model.enums.PlaceErrors.PLACE_TITLE_ALREADY_EXISTS;

@Service
@AllArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;
    private final PlaceMapper placeMapper;
    private final PlaceReportRepository placeReportRepository;

    @Override
    @Transactional
    public NewRecordVTO createPlace(PlaceDTO placeDTO) {
        PlaceSearchFilter placeSearchFilter=PlaceSearchFilter.builder().quickSearchQuery(placeDTO.getTitle()).pagination(PaginationInfo.noPagination()).build();
        Place placeExist=placeRepository.selectAllByFilters(placeSearchFilter).stream().findFirst().orElse(null);
        if(placeExist!=null) {
            throw new BusinessException(PLACE_TITLE_ALREADY_EXISTS, placeExist.getTitle());
        }
        Place place = placeMapper.toPlace(placeDTO);
        place = placeRepository.insert(place);
        return NewRecordVTO.builder().id(place.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updatePlace(Integer placeId, PlaceDTO placeDTO) {
        Place place = placeRepository.selectById(placeId)
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND, placeId));
        Place placeToUpdate = placeMapper.toPlace(placeDTO);
        placeToUpdate.setId(placeId);
        placeToUpdate.setCreatedOn(place.getCreatedOn());
        placeToUpdate.setCreatedBy(place.getCreatedBy());
        placeRepository.update(placeToUpdate);
        return NewRecordVTO.builder().id(placeId).build();
    }

    @Override
    @Transactional
    public void deletePlaceById(Integer placeId) {
        Place place = placeRepository.selectById(placeId)
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND, placeId));
        place.setIsDeleted(true);
        placeRepository.update(place);
    }

    @Override
    public PlaceVTO getPlaceById(Integer placeId, LocalDate createdOnFrom, LocalDate createdOnTo) {
        Place place = placeRepository.selectById(placeId)
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND, placeId));
        PlaceReportVTO placeReportVTO=placeReportRepository.getPlaceReport(placeId,createdOnFrom,createdOnTo);
        PlaceVTO placeVTO=placeMapper.toPlaceVTO(place);
        placeVTO.setPlaceReport(placeReportVTO);
        return placeVTO;
    }

    @Override
    public PlaceResultSet getAllPlacesByFilter(String quickSearch, Integer pageNum, Integer pageSize,
                                               OrderDirections orderDir, String orderBy) {
        PlaceSearchFilter filter = PlaceSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .pagination(pageNum!=null ? PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build():PaginationInfo.noPagination())
                .defaultSorting(orderBy!=null ? new SortingInfo<>(PlaceSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC):null)
                .sorting(orderBy!=null ? new SortingInfo<>(orderBy, orderDir):null)
                .build();

        List<Place> places = placeRepository.selectAllByFilters(filter);
        List<PlaceListItem> items = placeMapper.toPlaceListItems(places);

        return PlaceResultSet.builder()
                .items(items)
                .total(placeRepository.countAllByFilters(filter))
                .build();
    }

    @Override
    public LookupResultSet getAllPlacesLookup() {
        List<Place> places=placeRepository.selectAll();
        return LookupResultSet.builder()._list(placeMapper.toLookupVTOs(places)).total(places.size()).build();
    }
}