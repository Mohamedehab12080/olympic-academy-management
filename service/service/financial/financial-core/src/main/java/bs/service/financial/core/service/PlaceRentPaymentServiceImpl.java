package bs.service.financial.core.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.repository.PlaceRentPaymentRepository;
import bs.service.financial.api.service.PlaceRentPaymentService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.place.PlaceRentPayment;
import bs.service.financial.model.filter.PlaceRentPaymentSearchFilter;
import bs.service.financial.model.generated.PlaceRentPaymentDTO;
import bs.service.financial.model.generated.PlaceRentPaymentResultSet;
import bs.service.financial.model.generated.PlaceRentPaymentVTO;
import bs.service.place.api.repository.PlaceRepository;
import bs.service.place.model.entity.Place;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.*;

@Service
@AllArgsConstructor
public class PlaceRentPaymentServiceImpl implements PlaceRentPaymentService {

    private final PlaceRentPaymentRepository placeRentPaymentRepository;
    private final PlaceRepository placeRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createPlaceRentPayment(PlaceRentPaymentDTO placeRentPaymentDTO) {
        // Validate place exists
        Place place= placeRepository.selectById(placeRentPaymentDTO.getPlaceId())
                .orElseThrow(() -> new BusinessException(PLACE_NOT_FOUND_FOR_RENT, placeRentPaymentDTO.getPlaceId()));

        // Validate payment amount
        if (placeRentPaymentDTO.getRentAmount() == null || placeRentPaymentDTO.getRentAmount() <= 0) {
            throw new BusinessException(INVALID_RENT_AMOUNT);
        }

        PlaceRentPayment payment = financialMapper.toPlaceRentPayment(placeRentPaymentDTO);


        // Calculate remained amount
        Integer payedAmount = placeRentPaymentDTO.getPayedAmount() != null ? placeRentPaymentDTO.getPayedAmount() : 0;
        if(place.getRemainedValue()< payedAmount){
            throw new BusinessException(INVALID_RENT_AMOUNT);
        }
        Integer remainedValue= place.getRemainedValue()-payedAmount;
        place.setRemainedValue(remainedValue);
        placeRepository.update(place);
        payment.setPayedAmount(payedAmount);
        payment.setRemainedAmount(remainedValue);
        payment.setPlace(place);
        payment = placeRentPaymentRepository.insert(payment);
        return NewRecordVTO.builder().id(payment.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updatePlaceRentPayment(Integer paymentId, PlaceRentPaymentDTO placeRentPaymentDTO) {
        PlaceRentPayment payment = placeRentPaymentRepository.selectById(paymentId)
                .orElseThrow(() -> new BusinessException(PLACE_RENT_PAYMENT_NOT_FOUND, paymentId));

        PlaceRentPayment paymentToUpdate = financialMapper.toPlaceRentPayment(placeRentPaymentDTO);
        paymentToUpdate.setId(paymentId);

        // Recalculate remained amount
        Integer payedAmount = placeRentPaymentDTO.getPayedAmount() != null ? placeRentPaymentDTO.getPayedAmount() : 0;
        paymentToUpdate.setPayedAmount(payedAmount);
        paymentToUpdate.setRemainedAmount(paymentToUpdate.getRentAmount() - payedAmount);

        placeRentPaymentRepository.update(paymentToUpdate);
        return NewRecordVTO.builder().id(paymentId).build();
    }

    @Override
    @Transactional
    public void deletePlaceRentPayment(Integer paymentId) {
        PlaceRentPayment payment = placeRentPaymentRepository.selectById(paymentId)
                .orElseThrow(() -> new BusinessException(PLACE_RENT_PAYMENT_NOT_FOUND, paymentId));
        placeRentPaymentRepository.deleteById(paymentId);
    }

    @Override
    public PlaceRentPaymentVTO getPlaceRentPaymentById(Integer paymentId) {
        PlaceRentPayment payment = placeRentPaymentRepository.selectById(paymentId)
                .orElseThrow(() -> new BusinessException(PLACE_RENT_PAYMENT_NOT_FOUND, paymentId));
        return financialMapper.toPlaceRentPaymentVTO(payment);
    }

    @Override
    public PlaceRentPaymentResultSet getAllPlaceRentPaymentsByFilter(String quickSearch,Integer placeId, Integer rentTypeId,
                                                                     Integer paymentMethodId, PaymentStatus status,
                                                                     LocalDate paymentDateFrom, LocalDate paymentDateTo,
                                                                     Integer pageNum, Integer pageSize,
                                                                     OrderDirections orderDir, String orderBy) {
        PlaceRentPaymentSearchFilter filter = PlaceRentPaymentSearchFilter.builder()
                .quickSearch(quickSearch)
                .placeId(placeId)
                .rentTypeId(rentTypeId)
                .isDeleted(false)
                .paymentMethodId(paymentMethodId)
                .status(status!=null?status.id:null)
                .paymentDateFrom(paymentDateFrom)
                .paymentDateTo(paymentDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(PlaceRentPaymentSearchFilter.OrderByAttributes.PAYMENT_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<PlaceRentPayment> payments = placeRentPaymentRepository.selectAllByFilters(filter);
        List<PlaceRentPaymentVTO> items = financialMapper.toPlaceRentPaymentVTOs(payments);

        return PlaceRentPaymentResultSet.builder()
                .items(items)
                .total(placeRentPaymentRepository.countAllByFilters(filter))
                .build();
    }
}