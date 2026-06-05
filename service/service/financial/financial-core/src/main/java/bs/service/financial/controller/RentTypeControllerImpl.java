package bs.service.financial.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.RentTypeService;
import bs.service.financial.controller.generated.RentTypeController;
import bs.service.financial.model.generated.RentTypeDTO;
import bs.service.financial.model.generated.RentTypeResultSet;
import bs.service.financial.model.generated.RentTypeVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class RentTypeControllerImpl implements RentTypeController {

    private final RentTypeService rentTypeService;

    @Override
    public ResponseEntity<NewRecordVTO> _createRentType(RentTypeDTO rentTypeDTO) {
        NewRecordVTO result = rentTypeService.createRentType(rentTypeDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<Void> _deleteRentType(Integer rentTypeId) {
        rentTypeService.deleteRentType(rentTypeId);
        return ResponseEntity.ok().build();
    }

    @Override
    public ResponseEntity<RentTypeResultSet> _getAllRentTypes(
            String quickSearch, Integer pageNum, Integer pageSize,
            OrderDirections orderDir, String orderBy) {

        RentTypeResultSet result = rentTypeService.getAllRentTypes(
                quickSearch, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<RentTypeVTO> _getRentTypeById(Integer rentTypeId) {
        RentTypeVTO result = rentTypeService.getRentTypeById(rentTypeId);
        return ResponseEntity.ok(result);
    }

    @Override
    public ResponseEntity<NewRecordVTO> _updateRentType(Integer rentTypeId, RentTypeDTO rentTypeDTO) {
        NewRecordVTO result = rentTypeService.updateRentType(rentTypeId, rentTypeDTO);
        return ResponseEntity.ok(result);
    }
}