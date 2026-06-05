package bs.service.financial.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.repository.PaymentMethodRepository;
import bs.service.financial.api.service.PaymentMethodService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.PaymentMethod;
import bs.service.financial.model.filter.PaymentMethodSearchFilter;
import bs.service.financial.model.generated.PaymentMethodDTO;
import bs.service.financial.model.generated.PaymentMethodResultSet;
import bs.service.financial.model.generated.PaymentMethodVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.PAYMENT_METHOD_NOT_FOUND;

@Service
@AllArgsConstructor
public class PaymentMethodServiceImpl implements PaymentMethodService {

    private final PaymentMethodRepository paymentMethodRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createPaymentMethod(PaymentMethodDTO paymentMethodDTO) {
        PaymentMethod paymentMethod = financialMapper.toPaymentMethod(paymentMethodDTO);
        paymentMethod = paymentMethodRepository.insert(paymentMethod);
        return NewRecordVTO.builder().id(paymentMethod.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updatePaymentMethod(Integer paymentMethodId, PaymentMethodDTO paymentMethodDTO) {
        PaymentMethod paymentMethod = paymentMethodRepository.selectById(paymentMethodId)
                .orElseThrow(() -> new BusinessException(PAYMENT_METHOD_NOT_FOUND, paymentMethodId));
        PaymentMethod methodToUpdate = financialMapper.toPaymentMethod(paymentMethodDTO);
        methodToUpdate.setId(paymentMethodId);
        paymentMethodRepository.update(methodToUpdate);
        return NewRecordVTO.builder().id(paymentMethodId).build();
    }

    @Override
    @Transactional
    public void deletePaymentMethod(Integer paymentMethodId) {
        PaymentMethod paymentMethod = paymentMethodRepository.selectById(paymentMethodId)
                .orElseThrow(() -> new BusinessException(PAYMENT_METHOD_NOT_FOUND, paymentMethodId));
        paymentMethodRepository.update(paymentMethod); // Soft delete not needed, just remove
    }

    @Override
    public PaymentMethodVTO getPaymentMethodById(Integer paymentMethodId) {
        PaymentMethod paymentMethod = paymentMethodRepository.selectById(paymentMethodId)
                .orElseThrow(() -> new BusinessException(PAYMENT_METHOD_NOT_FOUND, paymentMethodId));
        return financialMapper.toPaymentMethodVTO(paymentMethod);
    }

    @Override
    public PaymentMethodResultSet getAllPaymentMethods(String quickSearch, Integer pageNum, Integer pageSize,
                                                       OrderDirections orderDir, String orderBy) {
        PaymentMethodSearchFilter filter = PaymentMethodSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(PaymentMethodSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<PaymentMethod> methods = paymentMethodRepository.selectAllByFilters(filter);
        List<PaymentMethodVTO> items = financialMapper.toPaymentMethodVTOs(methods);

        return PaymentMethodResultSet.builder()
                .items(items)
                .total(paymentMethodRepository.countAllByFilters(filter))
                .build();
    }
}