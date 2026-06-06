package bs.service.place.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.place.api.service.PlaceService;
import bs.service.place.controller.generated.PlaceController;
import bs.service.place.model.generated.PlaceDTO;
import bs.service.place.model.generated.PlaceResultSet;
import bs.service.place.model.generated.PlaceVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class PlaceControllerImpl implements PlaceController {

    private final PlaceService placeService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createPlace(PlaceDTO placeDTO) {
        NewRecordVTO result = placeService.createPlace(placeDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deletePlaceById(Integer placeId) {
        placeService.deletePlaceById(placeId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<PlaceResultSet> _getAllPlacesByFilter(String quickSearch, Integer pageNum,
                                                                Integer pageSize, OrderDirections orderDir,
                                                                String orderBy) {
        PlaceResultSet result = placeService.getAllPlacesByFilter(quickSearch, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<PlaceVTO> _getPlaceById(Integer placeId) {
        PlaceVTO result = placeService.getPlaceById(placeId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updatePlaceById(Integer placeId, PlaceDTO placeDTO) {
        NewRecordVTO result = placeService.updatePlace(placeId, placeDTO);
        return ResponseEntity.ok(result);
    }
}