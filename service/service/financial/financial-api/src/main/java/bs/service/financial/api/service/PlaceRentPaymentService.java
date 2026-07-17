package bs.service.financial.api.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.model.generated.PlaceRentPaymentDTO;
import bs.service.financial.model.generated.PlaceRentPaymentResultSet;
import bs.service.financial.model.generated.PlaceRentPaymentVTO;

import java.time.LocalDate;

public interface PlaceRentPaymentService {
    NewRecordVTO createPlaceRentPayment(PlaceRentPaymentDTO placeRentPaymentDTO);
    NewRecordVTO updatePlaceRentPayment(Integer paymentId, PlaceRentPaymentDTO placeRentPaymentDTO);
    void deletePlaceRentPayment(Integer paymentId);
    PlaceRentPaymentVTO getPlaceRentPaymentById(Integer paymentId);
    PlaceRentPaymentResultSet getAllPlaceRentPaymentsByFilter(String quickSearch,Integer placeId, Integer rentTypeId,
                                                              Integer paymentMethodId, PaymentStatus status,Boolean effect,
                                                              LocalDate paymentDateFrom, LocalDate paymentDateTo,
                                                              Integer pageNum, Integer pageSize,
                                                              OrderDirections orderDir, String orderBy);
}