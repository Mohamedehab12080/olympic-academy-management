package bs.service.financial.core.service;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.financial.api.repository.EnrollmentPaymentRepository;
import bs.service.financial.api.service.EnrollmentPaymentService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.enrollment.EnrollmentPayment;
import bs.service.financial.model.filter.EnrollmentPaymentSearchFilter;
import bs.service.financial.model.generated.EnrollmentPaymentDTO;
import bs.service.financial.model.generated.EnrollmentPaymentResultSet;
import bs.service.financial.model.generated.EnrollmentPaymentVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.*;

@Service
@AllArgsConstructor
public class EnrollmentPaymentServiceImpl implements EnrollmentPaymentService {

    private final EnrollmentPaymentRepository enrollmentPaymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createEnrollmentPayment(EnrollmentPaymentDTO enrollmentPaymentDTO) {
        // Validate enrollment exists
        Enrollment enrollment = enrollmentRepository.selectById(enrollmentPaymentDTO.getEnrollmentId())
                .orElseThrow(() -> new BusinessException(ENROLLMENT_NOT_FOUND_FOR_PAYMENT, enrollmentPaymentDTO.getEnrollmentId()));

        // Validate payment amount doesn't exceed remaining amount
        Integer remainedAmount = enrollment.getFinalSubscriptionValue() - enrollmentPaymentDTO.getPaidAmount();
        if (enrollmentPaymentDTO.getPaidAmount() > remainedAmount) {
            throw new BusinessException(PAYMENT_AMOUNT_EXCEEDS_REMAINING);
        }

        EnrollmentPayment payment = financialMapper.toEnrollmentPayment(enrollmentPaymentDTO);
        payment.setEnrollment(enrollment);

        // Update enrollment payment status and amounts
        enrollment.setRemainedSubscriptionValue(remainedAmount);

        if (enrollment.getRemainedSubscriptionValue() <= 0) {
            enrollment.setPaymentStatus(PaymentStatus.PAID.id);
            payment.setPaymentStatus(PaymentStatus.PAID.id);
        } else if (enrollmentPaymentDTO.getPaidAmount() > 0) {
            enrollment.setPaymentStatus(PaymentStatus.PARTIAL.id);
            payment.setPaymentStatus(PaymentStatus.PARTIAL.id);
        }
        payment = enrollmentPaymentRepository.insert(payment);
        enrollmentRepository.update(enrollment);

        return NewRecordVTO.builder().id(payment.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEnrollmentPayment(Integer paymentId, EnrollmentPaymentDTO enrollmentPaymentDTO) {
        EnrollmentPayment payment = enrollmentPaymentRepository.selectById(paymentId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_PAYMENT_NOT_FOUND, paymentId));

        EnrollmentPayment paymentToUpdate = financialMapper.toEnrollmentPayment(enrollmentPaymentDTO);
        paymentToUpdate.setId(paymentId);
        enrollmentPaymentRepository.update(paymentToUpdate);
        return NewRecordVTO.builder().id(paymentId).build();
    }

    @Override
    @Transactional
    public void deleteEnrollmentPayment(Integer paymentId) {
        EnrollmentPayment payment = enrollmentPaymentRepository.selectById(paymentId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_PAYMENT_NOT_FOUND, paymentId));
        payment.setIsDeleted(true);
        enrollmentPaymentRepository.update(payment);
    }

    @Override
    public EnrollmentPaymentVTO getEnrollmentPaymentById(Integer paymentId) {
        EnrollmentPayment payment = enrollmentPaymentRepository.selectById(paymentId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_PAYMENT_NOT_FOUND, paymentId));
        return financialMapper.toEnrollmentPaymentVTO(payment);
    }

    @Override
    public EnrollmentPaymentResultSet getAllEnrollmentPaymentsByFilter(Integer enrollmentId, Integer paymentMethodId,
                                                                       PaymentStatus status, LocalDate paymentDateFrom,
                                                                       LocalDate paymentDateTo, Integer pageNum,
                                                                       Integer pageSize, OrderDirections orderDir,
                                                                       String orderBy) {
        EnrollmentPaymentSearchFilter filter = EnrollmentPaymentSearchFilter.builder()
                .enrollmentId(enrollmentId)
                .paymentMethodId(paymentMethodId)
                .status(status!=null?status.id:null)
                .paymentDateFrom(paymentDateFrom)
                .paymentDateTo(paymentDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EnrollmentPaymentSearchFilter.OrderByAttributes.PAYMENT_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<EnrollmentPayment> payments = enrollmentPaymentRepository.selectAllByFilters(filter);
        List<EnrollmentPaymentVTO> items = financialMapper.toEnrollmentPaymentVTOs(payments);

        return EnrollmentPaymentResultSet.builder()
                .items(items)
                .total(items.size())
                .build();
    }
}