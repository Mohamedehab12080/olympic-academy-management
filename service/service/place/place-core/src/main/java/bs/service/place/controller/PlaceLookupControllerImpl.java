package bs.service.place.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.place.api.service.PlaceService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;


@RestController
@AllArgsConstructor
public class PlaceLookupControllerImpl {

    private final PlaceService placeService;

    public ResponseEntity<LookupResultSet> getAllPlacesLookup() {
       return ResponseEntity.ok(placeService.getAllPlacesLookup());
    }
}