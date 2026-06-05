package bs.service.financial.core.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.enrollment.model.enums.EnrollmentStatus;
import bs.service.financial.api.repository.EnrollmentRefundRepository;
import bs.service.financial.api.service.EnrollmentRefundService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.enrollment.EnrollmentRefund;
import bs.service.financial.model.enums.RefundStatus;
import bs.service.financial.model.filter.EnrollmentRefundSearchFilter;
import bs.service.financial.model.generated.EnrollmentRefundDTO;
import bs.service.financial.model.generated.EnrollmentRefundResultSet;
import bs.service.financial.model.generated.EnrollmentRefundVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.*;

@Service
@AllArgsConstructor
public class EnrollmentRefundServiceImpl implements EnrollmentRefundService {

    private final EnrollmentRefundRepository enrollmentRefundRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createEnrollmentRefund(EnrollmentRefundDTO enrollmentRefundDTO) {
        Enrollment enrollment = enrollmentRepository.selectById(enrollmentRefundDTO.getEnrollmentId())
                .orElseThrow(() -> new BusinessException(ENROLLMENT_NOT_FOUND_FOR_PAYMENT, enrollmentRefundDTO.getEnrollmentId()));

        Integer paidAmount=enrollment.getFinalSubscriptionValue()-enrollment.getRemainedSubscriptionValue();
        if (enrollmentRefundDTO.getAmountRefunded() >paidAmount) {
            throw new BusinessException(REFUND_AMOUNT_EXCEEDS_PAID);
        }

        EnrollmentRefund refund = financialMapper.toEnrollmentRefund(enrollmentRefundDTO);
        refund.setEnrollment(enrollment);
        refund = enrollmentRefundRepository.insert(refund);
        enrollment.setPaymentStatus(PaymentStatus.REFUNDED);
        enrollment.setEnrollmentStatus(EnrollmentStatus.CANCELLED);
        enrollment.setRemainedSubscriptionValue(enrollmentRefundDTO.getAmountRefunded()-paidAmount);
        enrollmentRepository.update(enrollment);

        return NewRecordVTO.builder().id(refund.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEnrollmentRefund(Integer refundId, EnrollmentRefundDTO enrollmentRefundDTO) {
        EnrollmentRefund refund = enrollmentRefundRepository.selectById(refundId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_REFUND_NOT_FOUND, refundId));

        EnrollmentRefund refundToUpdate = financialMapper.toEnrollmentRefund(enrollmentRefundDTO);
        refundToUpdate.setId(refundId);
        enrollmentRefundRepository.update(refundToUpdate);
        return NewRecordVTO.builder().id(refundId).build();
    }

    @Override
    @Transactional
    public void deleteEnrollmentRefund(Integer refundId) {
        EnrollmentRefund refund = enrollmentRefundRepository.selectById(refundId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_REFUND_NOT_FOUND, refundId));
        refund.setIsDeleted(true);
        enrollmentRefundRepository.update(refund);
    }

    @Override
    public EnrollmentRefundVTO getEnrollmentRefundById(Integer refundId) {
        EnrollmentRefund refund = enrollmentRefundRepository.selectById(refundId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_REFUND_NOT_FOUND, refundId));
        return financialMapper.toEnrollmentRefundVTO(refund);
    }

    @Override
    public EnrollmentRefundResultSet getAllEnrollmentRefundsByFilter(Integer enrollmentId, Integer paymentMethodId,
                                                                     RefundStatus status, LocalDate refundDateFrom,
                                                                     LocalDate refundDateTo, Integer pageNum,
                                                                     Integer pageSize, OrderDirections orderDir,
                                                                     String orderBy) {
        EnrollmentRefundSearchFilter filter = EnrollmentRefundSearchFilter.builder()
                .enrollmentId(enrollmentId)
                .paymentMethodId(paymentMethodId)
                .status(status)
                .refundDateFrom(refundDateFrom)
                .refundDateTo(refundDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EnrollmentRefundSearchFilter.OrderByAttributes.REFUND_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<EnrollmentRefund> refunds = enrollmentRefundRepository.selectAllByFilters(filter);
        List<EnrollmentRefundVTO> items = financialMapper.toEnrollmentRefundVTOs(refunds);

        return EnrollmentRefundResultSet.builder()
                .items(items)
                .total(enrollmentRefundRepository.countAllByFilters(filter))
                .build();
    }
}