package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.PlaceRentPaymentRepository;
import bs.service.financial.model.entity.place.PlaceRentPayment;
import bs.service.financial.model.filter.PlaceRentPaymentSearchFilter;
import bs.service.financial.repository.jpa.PlaceRentPaymentJPARepository;
import bs.service.financial.repository.query.PlaceRentPaymentQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class PlaceRentPaymentRepositoryImpl implements PlaceRentPaymentRepository {

    private final PlaceRentPaymentJPARepository placeRentPaymentJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final PlaceRentPaymentQueryBuilder queryBuilder;

    @Override
    public PlaceRentPayment insert(PlaceRentPayment placeRentPayment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        placeRentPayment.setCreatedBy(currentUser);
        placeRentPayment.setCreatedOn(LocalDateTime.now());
        placeRentPayment.setIsDeleted(false);
        return placeRentPaymentJPARepository.save(placeRentPayment);
    }

    @Override
    public PlaceRentPayment update(PlaceRentPayment placeRentPayment) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        placeRentPayment.setLastModifiedBy(currentUser);
        placeRentPayment.setLastModifiedOn(LocalDateTime.now());
        return placeRentPaymentJPARepository.save(placeRentPayment);
    }

    @Override
    public Optional<PlaceRentPayment> selectById(Integer id) {
        return placeRentPaymentJPARepository.findById(id);
    }

    @Override
    public List<PlaceRentPayment> selectAllByFilters(PlaceRentPaymentSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(PlaceRentPaymentSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer paymentId) {
        placeRentPaymentJPARepository.deleteById(paymentId);
    }
}