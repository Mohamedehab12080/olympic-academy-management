package bs.service.financial.controller;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.service.PaymentMethodService;
import bs.service.financial.controller.generated.PaymentMethodController;
import bs.service.financial.model.generated.PaymentMethodDTO;
import bs.service.financial.model.generated.PaymentMethodResultSet;
import bs.service.financial.model.generated.PaymentMethodVTO;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

@Controller
@AllArgsConstructor
public class PaymentMethodControllerImpl implements PaymentMethodController {

    private final PaymentMethodService paymentMethodService;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _createPaymentMethod(PaymentMethodDTO paymentMethodDTO) {
        NewRecordVTO result = paymentMethodService.createPaymentMethod(paymentMethodDTO);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<Void> _deletePaymentMethod(Integer paymentMethodId) {
        paymentMethodService.deletePaymentMethod(paymentMethodId);
        return ResponseEntity.ok().build();
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<PaymentMethodResultSet> _getAllPaymentMethods(
            String quickSearch, Integer pageNum, Integer pageSize,
            OrderDirections orderDir, String orderBy) {

        PaymentMethodResultSet result = paymentMethodService.getAllPaymentMethods(
                quickSearch, pageNum, pageSize, orderDir, orderBy);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<PaymentMethodVTO> _getPaymentMethodById(Integer paymentMethodId) {
        PaymentMethodVTO result = paymentMethodService.getPaymentMethodById(paymentMethodId);
        return ResponseEntity.ok(result);
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<NewRecordVTO> _updatePaymentMethod(Integer paymentMethodId, PaymentMethodDTO paymentMethodDTO) {
        NewRecordVTO result = paymentMethodService.updatePaymentMethod(paymentMethodId, paymentMethodDTO);
        return ResponseEntity.ok(result);
    }
}