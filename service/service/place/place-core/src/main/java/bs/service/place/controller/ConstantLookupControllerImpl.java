package bs.service.place.controller;

import bs.lib.common.model.generated.LookupResultSet;
import bs.service.place.api.service.ConstantService;
import bs.service.place.controller.generated.ConstantLookupController;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class ConstantLookupControllerImpl implements ConstantLookupController {
    private final ConstantService constantService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllConstantsLookup() {
        return ResponseEntity.ok(constantService.getAllConstantsLookup());
    }
}
