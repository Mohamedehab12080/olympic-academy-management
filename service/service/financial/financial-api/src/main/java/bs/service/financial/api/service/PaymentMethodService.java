package bs.service.financial.api.service;

import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.PaymentMethodDTO;
import bs.service.financial.model.generated.PaymentMethodResultSet;
import bs.service.financial.model.generated.PaymentMethodVTO;

public interface PaymentMethodService {
    NewRecordVTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO);
    NewRecordVTO updatePaymentMethod(Integer paymentMethodId, PaymentMethodDTO paymentMethodDTO);
    void deletePaymentMethod(Integer paymentMethodId);
    PaymentMethodVTO getPaymentMethodById(Integer paymentMethodId);
    PaymentMethodResultSet getAllPaymentMethods(String quickSearch, Integer pageNum, Integer pageSize,
                                                OrderDirections orderDir, String orderBy);
}