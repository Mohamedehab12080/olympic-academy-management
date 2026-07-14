package bs.service.financial.api.repository;

import bs.service.financial.model.entity.place.PlaceRentPayment;
import bs.service.financial.model.filter.PlaceRentPaymentSearchFilter;

import java.util.List;
import java.util.Optional;

public interface PlaceRentPaymentRepository {
    PlaceRentPayment insert(PlaceRentPayment placeRentPayment);
    PlaceRentPayment update(PlaceRentPayment placeRentPayment);
    Optional<PlaceRentPayment> selectById(Integer id);
    List<PlaceRentPayment> selectAllByFilters(PlaceRentPaymentSearchFilter filters);
    Integer countAllByFilters(PlaceRentPaymentSearchFilter filters);
    void deleteById(Integer paymentId);
}