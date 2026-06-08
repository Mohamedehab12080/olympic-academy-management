package bs.service.financial.core.mapper;

import bs.lib.common.model.Utils.EnumMapperUtils;
import bs.lib.common.model.enums.ContactTypes;
import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.course.model.entity.Course;
import bs.service.employee.model.entity.Employee;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.employee.model.enums.SessionStatus;
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
import bs.service.financial.model.enums.RefundStatus;
import bs.service.financial.model.enums.SalaryTransactionType;
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

    // ==================== Lookup Mappings (Auto-detected by MapStruct) ====================

    public abstract LookupVTO toLookupVTO(PaymentMethod paymentMethod);
    public abstract LookupVTO toLookupVTO(RentType rentType);
    public abstract LookupVTO toLookupVTO(ExpenseType expenseType);
    public abstract LookupVTO toLookupVTO(Place place);
    public abstract LookupVTO toLookupVTO(Employee employee);
    public abstract LookupVTO toLookupVTO(Enrollment enrollment);
    public abstract LookupVTO toLookupVTO(Course course);

    // ==================== Direct Enum to LookupVTO Mappings ====================

    LookupVTO toLookupVTOFromRefundStatus(Integer refundStatusId) {
        return EnumMapperUtils.toLookupVTO(refundStatusId, RefundStatus.class);
    }

    LookupVTO toLookupVTOFromPaymentStatus(Integer paymentStatusId) {
        return EnumMapperUtils.toLookupVTO(paymentStatusId, PaymentStatus.class);
    }

    LookupVTO toLookupVTOFromSalaryType(Integer salaryTypeId) {
        return EnumMapperUtils.toLookupVTO(salaryTypeId, SalaryTypes.class);
    }

    LookupVTO toLookupVTOFromSalaryTransactionType(Integer salaryTransactionTypeId) {
        return EnumMapperUtils.toLookupVTO(salaryTransactionTypeId, SalaryTransactionType.class);
    }

    LookupVTO toLookupVTOFromGender(Integer genderId) {
        return EnumMapperUtils.toLookupVTO(genderId, Gender.class);
    }

    // ==================== DTO to Entity Mappings (extract IDs) ====================

    @Mapping(target = "expenseType.id", source = "expenseTypeId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    public abstract Expense toExpense(ExpenseDTO expenseDTO);

    @Mapping(target = "enrollment.id", source = "enrollmentId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    @Mapping(target = "paymentStatus", source = "paymentStatus.id")
    public abstract EnrollmentPayment toEnrollmentPayment(EnrollmentPaymentDTO enrollmentPaymentDTO);

    @Mapping(target = "enrollment.id", source = "enrollmentId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    @Mapping(target = "refundStatus", source = "status.id")
    public abstract EnrollmentRefund toEnrollmentRefund(EnrollmentRefundDTO enrollmentRefundDTO);

    @Mapping(target = "employee.id", source = "employeeId")
    @Mapping(target = "paymentMethod.id", source = "paymentMethodId")
    @Mapping(target = "salaryType", source = "salaryType.id")
    @Mapping(target = "salaryTransactionType", source = "salaryTransactionType.id")
    public abstract SalaryIncentive toSalaryIncentive(SalaryIncentiveDTO salaryIncentiveDTO);

    @Mapping(target = "employee.id", source = "employeeId")
    @Mapping(target = "salaryType", source = "salaryType.id")
    public abstract SalaryDeduction toSalaryDeduction(SalaryDeductionDTO salaryDeductionDTO);

    // ==================== Simple DTO to Entity Mappings ====================

    public abstract PaymentMethod toPaymentMethod(PaymentMethodDTO paymentMethodDTO);
    public abstract RentType toRentType(RentTypeDTO rentTypeDTO);
    public abstract ExpenseType toExpenseType(ExpenseTypeDTO expenseTypeDTO);
    public abstract PlaceRentPayment toPlaceRentPayment(PlaceRentPaymentDTO placeRentPaymentDTO);

    // ==================== Entity to VTO Mappings (convert IDs to LookupVTO) ====================

    public abstract PaymentMethodVTO toPaymentMethodVTO(PaymentMethod paymentMethod);
    public abstract List<PaymentMethodVTO> toPaymentMethodVTOs(List<PaymentMethod> paymentMethods);

    public abstract RentTypeVTO toRentTypeVTO(RentType rentType);
    public abstract List<RentTypeVTO> toRentTypeVTOs(List<RentType> rentTypes);

    public abstract ExpenseTypeVTO toExpenseTypeVTO(ExpenseType expenseType);
    public abstract List<ExpenseTypeVTO> toExpenseTypeVTOs(List<ExpenseType> expenseTypes);

    public abstract PlaceRentPaymentVTO toPlaceRentPaymentVTO(PlaceRentPayment placeRentPayment);
    public abstract List<PlaceRentPaymentVTO> toPlaceRentPaymentVTOs(List<PlaceRentPayment> placeRentPayments);

    public abstract ExpenseVTO toExpenseVTO(Expense expense);
    public abstract List<ExpenseVTO> toExpenseVTOs(List<Expense> expenses);

    // Use direct enum to LookupVTO mapping
    @Mapping(target = "paymentStatus", expression = "java(toLookupVTOFromPaymentStatus(enrollmentPayment.getPaymentStatus()))")
    public abstract EnrollmentPaymentVTO toEnrollmentPaymentVTO(EnrollmentPayment enrollmentPayment);

    public abstract List<EnrollmentPaymentVTO> toEnrollmentPaymentVTOs(List<EnrollmentPayment> enrollmentPayments);

    // Use direct enum to LookupVTO mapping
    @Mapping(target = "refundStatus", expression = "java(toLookupVTOFromRefundStatus(enrollmentRefund.getRefundStatus()))")
    public abstract EnrollmentRefundVTO toEnrollmentRefundVTO(EnrollmentRefund enrollmentRefund);

    public abstract List<EnrollmentRefundVTO> toEnrollmentRefundVTOs(List<EnrollmentRefund> enrollmentRefunds);

    // Use direct enum to LookupVTO mapping
    @Mapping(target = "salaryType", expression = "java(toLookupVTOFromSalaryType(salaryIncentive.getSalaryType()))")
    @Mapping(target = "salaryTransactionType", expression = "java(toLookupVTOFromSalaryTransactionType(salaryIncentive.getSalaryTransactionType()))")
    public abstract SalaryIncentiveVTO toSalaryIncentiveVTO(SalaryIncentive salaryIncentive);

    public abstract List<SalaryIncentiveVTO> toSalaryIncentiveVTOs(List<SalaryIncentive> salaryIncentives);

    // Use direct enum to LookupVTO mapping
    @Mapping(target = "salaryType", expression = "java(toLookupVTOFromSalaryType(salaryDeduction.getSalaryType()))")
    public abstract SalaryDeductionVTO toSalaryDeductionVTO(SalaryDeduction salaryDeduction);

    public abstract List<SalaryDeductionVTO> toSalaryDeductionVTOs(List<SalaryDeduction> salaryDeductions);

    // ==================== List Lookup Mappings (for lookup endpoints) ====================

    public abstract List<LookupVTO> toLookupPaymentMethodVTOs(List<PaymentMethod> paymentMethods);
    public abstract List<LookupVTO> toLookupRentTypeVTOs(List<RentType> rentTypes);
    public abstract List<LookupVTO> toLookupExpenseTypeVTOs(List<ExpenseType> expenseTypes);
//
    // Enum to LookupVTO for list lookups - uses the direct mapping methods
   public abstract LookupVTO toLookupVTO(PaymentStatus paymentStatuses);
    public abstract LookupVTO toLookupVTO(RefundStatus refundStatuses);
    public abstract LookupVTO toLookupVTO(SalaryTransactionType salaryTransactionTypes);
    public abstract LookupVTO toLookupVTO(SalaryTypes salaryTypes);

//    // Enum to LookupVTO for list lookups - uses the direct mapping methods
//    public abstract List<LookupVTO> toLookupPaymentStatusVTOs(List<PaymentStatus> paymentStatuses);
//    public abstract List<LookupVTO> toLookupRefundStatusVTOs(List<RefundStatus> refundStatuses);
//    public abstract List<LookupVTO> toLookupSalaryTransactionTypeVTOs(List<SalaryTransactionType> salaryTransactionTypes);
//    public abstract List<LookupVTO> toLookupSalaryTypeVTOs(List<SalaryTypes> salaryTypes);
}