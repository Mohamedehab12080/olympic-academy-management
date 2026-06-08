package bs.service.place.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.place.api.service.PlaceService;
import bs.service.place.controller.generated.LookupController;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;


@RestController
@AllArgsConstructor
public class PlaceLookupControllerImpl implements LookupController {

    private final PlaceService placeService;

    @Override
    public ResponseEntity<LookupResultSet> _getAllPlacesLookup() {
        return ResponseEntity.ok(placeService.getAllPlacesLookup());
    }
}