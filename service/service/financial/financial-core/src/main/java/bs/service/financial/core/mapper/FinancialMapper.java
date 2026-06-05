package bs.service.financial.core.mapper;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.Employee;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.financial.model.entity.*;
import bs.service.financial.model.entity.enrollment.EnrollmentPayment;
import bs.service.financial.model.entity.enrollment.EnrollmentRefund;
import bs.service.financial.model.entity.expense.Expense;
import bs.service.financial.model.entity.expense.ExpenseType;
import bs.service.financial.model.entity.place.PlaceRentPayment;
import bs.service.financial.model.entity.place.RentType;
import bs.service.financial.model.entity.salary.deduction.SalaryDeduction;
import bs.service.financial.model.entity.salary.incentive.SalaryIncentive;
import bs.service.financial.model.enums.*;
import bs.service.financial.model.generated.*;
import bs.service.place.model.entity.Place;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import org.mapstruct.*;

import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.List;

@Mapper(componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        injectionStrategy = InjectionStrategy.CONSTRUCTOR,
        imports = {OffsetDateTime.class, ZoneOffset.class})
public abstract class FinancialMapper {

    // ==================== User Mapping ====================

    public abstract LightUserVTO toLightUserVTO(User user);

    // ==================== Lookup Mappings ====================

    public abstract LookupVTO toLookupVTO(PaymentMethod paymentMethod);
    public abstract LookupVTO toLookupVTO(RentType rentType);
    public abstract LookupVTO toLookupVTO(ExpenseType expenseType);
    public abstract LookupVTO toLookupVTO(Place place);
    public abstract LookupVTO toLookupVTO(Employee employee);
    public abstract LookupVTO toLookupVTO(Enrollment enrollment);
    public abstract LookupVTO toLookupVTO(Course course);

    // ==================== Payment Method Mappings ====================

    public abstract PaymentMethod toPaymentMethod(PaymentMethodDTO paymentMethodDTO);

    public abstract PaymentMethodVTO toPaymentMethodVTO(PaymentMethod paymentMethod);

    public abstract List<PaymentMethodVTO> toPaymentMethodVTOs(List<PaymentMethod> paymentMethods);

    // ==================== Rent Type Mappings ====================

    public abstract RentType toRentType(RentTypeDTO rentTypeDTO);

    public abstract RentTypeVTO toRentTypeVTO(RentType rentType);

    public abstract List<RentTypeVTO> toRentTypeVTOs(List<RentType> rentTypes);

    // ==================== Expense Type Mappings ====================

    public abstract ExpenseType toExpenseType(ExpenseTypeDTO expenseTypeDTO);

    public abstract ExpenseTypeVTO toExpenseTypeVTO(ExpenseType expenseType);

    public abstract List<ExpenseTypeVTO> toExpenseTypeVTOs(List<ExpenseType> expenseTypes);

    // ==================== Place Rent Payment Mappings ====================

    public abstract PlaceRentPayment toPlaceRentPayment(PlaceRentPaymentDTO placeRentPaymentDTO);

    public abstract PlaceRentPaymentVTO toPlaceRentPaymentVTO(PlaceRentPayment placeRentPayment);

    public abstract List<PlaceRentPaymentVTO> toPlaceRentPaymentVTOs(List<PlaceRentPayment> placeRentPayments);

    // ==================== Expense Mappings ====================

    @Mapping(target = "expenseType.id", source = "expenseTypeId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    public abstract Expense toExpense(ExpenseDTO expenseDTO);

    public abstract ExpenseVTO toExpenseVTO(Expense expense);

    public abstract List<ExpenseVTO> toExpenseVTOs(List<Expense> expenses);

    // ==================== Enrollment Payment Mappings ====================

    @Mapping(target = "enrollment.id", source = "enrollmentId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    public abstract EnrollmentPayment toEnrollmentPayment(EnrollmentPaymentDTO enrollmentPaymentDTO);

    public abstract EnrollmentPaymentVTO toEnrollmentPaymentVTO(EnrollmentPayment enrollmentPayment);

    public abstract List<EnrollmentPaymentVTO> toEnrollmentPaymentVTOs(List<EnrollmentPayment> enrollmentPayments);

    // ==================== Enrollment Refund Mappings ====================

    @Mapping(target = "enrollment.id", source = "enrollmentId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    public abstract EnrollmentRefund toEnrollmentRefund(EnrollmentRefundDTO enrollmentRefundDTO);

    public abstract EnrollmentRefundVTO toEnrollmentRefundVTO(EnrollmentRefund enrollmentRefund);

    public abstract List<EnrollmentRefundVTO> toEnrollmentRefundVTOs(List<EnrollmentRefund> enrollmentRefunds);

    // ==================== Salary Incentive Mappings ====================

    @Mapping(target = "employee.id", source = "employeeId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    public abstract SalaryIncentive toSalaryIncentive(SalaryIncentiveDTO salaryIncentiveDTO);

    public abstract SalaryIncentiveVTO toSalaryIncentiveVTO(SalaryIncentive salaryIncentive);

    public abstract List<SalaryIncentiveVTO> toSalaryIncentiveVTOs(List<SalaryIncentive> salaryIncentives);

    // ==================== Salary Deduction Mappings ====================

    @Mapping(target = "employee.id", source = "employeeId")
    public abstract SalaryDeduction toSalaryDeduction(SalaryDeductionDTO salaryDeductionDTO);

    public abstract SalaryDeductionVTO toSalaryDeductionVTO(SalaryDeduction salaryDeduction);

    public abstract List<SalaryDeductionVTO> toSalaryDeductionVTOs(List<SalaryDeduction> salaryDeductions);

    // ==================== Enum Lookup Mappings ====================

    @Mapping(target = "id", expression = "java(paymentStatus.getId())")
    @Mapping(target = "title", expression = "java(paymentStatus.getTitle())")
    public abstract LookupVTO toLookupVTO(PaymentStatus paymentStatus);

    @Mapping(target = "id", expression = "java(refundStatus.getId())")
    @Mapping(target = "title", expression = "java(refundStatus.getTitle())")
    public abstract LookupVTO toLookupVTO(RefundStatus refundStatus);

    @Mapping(target = "id", expression = "java(salaryTransactionType.getId())")
    @Mapping(target = "title", expression = "java(salaryTransactionType.getTitle())")
    public abstract LookupVTO toLookupVTO(SalaryTransactionType salaryTransactionType);

    @Mapping(target = "id", expression = "java(salaryType.getId())")
    @Mapping(target = "title", expression = "java(salaryType.getTitle())")
    public abstract LookupVTO toLookupVTO(SalaryTypes salaryType);

    // ==================== List Lookup Mappings ====================

    public abstract List<LookupVTO> toLookupPaymentStatusVTOs(List<PaymentStatus> paymentStatuses);
    public abstract List<LookupVTO> toLookupRefundStatusVTOs(List<RefundStatus> refundStatuses);
    public abstract List<LookupVTO> toLookupSalaryTransactionTypeVTOs(List<SalaryTransactionType> salaryTransactionTypes);
    public abstract List<LookupVTO> toLookupSalaryTypeVTOs(List<SalaryTypes> salaryTypes);
    public abstract List<LookupVTO> toLookupPaymentMethodVTOs(List<PaymentMethod> paymentMethods);
    public abstract List<LookupVTO> toLookupRentTypeVTOs(List<RentType> rentTypes);
    public abstract List<LookupVTO> toLookupExpenseTypeVTOs(List<ExpenseType> expenseTypes);
}