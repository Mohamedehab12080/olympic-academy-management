package bs.service.place.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.place.api.service.ConstantService;
import bs.service.place.controller.generated.ConstantController;
import bs.service.place.model.generated.ConstantDTO;
import bs.service.place.model.generated.ConstantResultSet;
import bs.service.place.model.generated.ConstantVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.RestController;

@RestController
@AllArgsConstructor
public class ConstantControllerImpl implements ConstantController {

    private final ConstantService constantService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createConstant(ConstantDTO constantDTO) {
        return ResponseEntity.ok(constantService.createConstant(constantDTO));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deleteConstantById(Integer constantId) {
        constantService.deleteConstantById(constantId);
        return ResponseEntity.noContent().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ConstantResultSet> _getAllConstantsByFilter(String value, String location, String position, String quickSearch, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {
        return ResponseEntity.ok(constantService.getAllConstantsByFilter(value,location,position,quickSearch,pageNum,pageSize,orderDir,orderBy));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<ConstantVTO> _getConstantById(Integer constantId) {
        return ResponseEntity.ok(constantService.getConstantById(constantId));
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updateConstantById(Integer constantId, ConstantDTO constantDTO) {
        return ResponseEntity.ok(constantService.updateConstant(constantId,constantDTO));
    }
}
