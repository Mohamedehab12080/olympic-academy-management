package bs.service.financial.controller;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.PlaceRentPaymentService;
import bs.service.financial.controller.generated.PlaceRentPaymentController;
import bs.service.financial.model.generated.PlaceRentPaymentDTO;
import bs.service.financial.model.generated.PlaceRentPaymentResultSet;
import bs.service.financial.model.generated.PlaceRentPaymentVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

import java.time.LocalDate;

@Controller
@AllArgsConstructor
public class placeRentPaymentControllerImpl implements PlaceRentPaymentController {

    private final PlaceRentPaymentService placeRentPaymentService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createPlaceRentPayment(PlaceRentPaymentDTO placeRentPaymentDTO) {
        NewRecordVTO result = placeRentPaymentService.createPlaceRentPayment(placeRentPaymentDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deletePlaceRentPayment(Integer paymentId) {
        placeRentPaymentService.deletePlaceRentPayment(paymentId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<PlaceRentPaymentResultSet> _getAllPlaceRentPaymentsByFilter(String quickSearch,
            Integer placeId, Integer rentTypeId, Integer paymentMethodId, PaymentStatus status,
            LocalDate paymentDateFrom, LocalDate paymentDateTo,
            Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        PlaceRentPaymentResultSet result = placeRentPaymentService.getAllPlaceRentPaymentsByFilter(
                quickSearch,placeId, rentTypeId, paymentMethodId, status, paymentDateFrom, paymentDateTo,
                pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<PlaceRentPaymentVTO> _getPlaceRentPaymentById(Integer paymentId) {
        PlaceRentPaymentVTO result = placeRentPaymentService.getPlaceRentPaymentById(paymentId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updatePlaceRentPayment(Integer paymentId, PlaceRentPaymentDTO placeRentPaymentDTO) {
        NewRecordVTO result = placeRentPaymentService.updatePlaceRentPayment(paymentId, placeRentPaymentDTO);
        return ResponseEntity.ok(result);
    }
}