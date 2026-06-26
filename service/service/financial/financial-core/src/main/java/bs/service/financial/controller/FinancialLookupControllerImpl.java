package bs.service.financial.controller;

import bs.lib.common.model.enums.PaymentStatus;
import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.financial.api.repository.ExpenseTypeRepository;
import bs.service.financial.api.repository.PaymentMethodRepository;
import bs.service.financial.api.repository.RentTypeRepository;
import bs.service.financial.controller.generated.LookupController;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.PaymentMethod;
import bs.service.financial.model.entity.expense.ExpenseType;
import bs.service.financial.model.entity.place.RentType;
import bs.service.financial.model.enums.RefundStatus;
import bs.service.financial.model.enums.SalaryTransactionType;
import bs.service.financial.model.filter.ExpenseTypeSearchFilter;
import bs.service.financial.model.filter.PaymentMethodSearchFilter;
import bs.service.financial.model.filter.RentTypeSearchFilter;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@AllArgsConstructor
public class FinancialLookupControllerImpl implements LookupController {

    private final PaymentMethodRepository paymentMethodRepository;
    private final RentTypeRepository rentTypeRepository;
    private final ExpenseTypeRepository expenseTypeRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllExpenseTypesLookup(Boolean isActive) {
        ExpenseTypeSearchFilter filter = ExpenseTypeSearchFilter.builder()
                .isActive(isActive)
                .build();

        List<ExpenseType> expenseTypes = expenseTypeRepository.selectAllByFilters(filter);
        List<LookupVTO> items = financialMapper.toLookupExpenseTypeVTOs(expenseTypes);

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(expenseTypeRepository.countAllByFilters(filter))
                .build());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllPaymentMethodsLookup() {
        PaymentMethodSearchFilter filter = PaymentMethodSearchFilter.builder().build();

        List<PaymentMethod> paymentMethods = paymentMethodRepository.selectAllByFilters(filter);
        List<LookupVTO> items = financialMapper.toLookupPaymentMethodVTOs(paymentMethods);

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(paymentMethodRepository.countAllByFilters(filter))
                .build());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllPaymentStatusLookup() {
        List<LookupVTO> items = Arrays.stream(PaymentStatus.values())
                .map(financialMapper::toLookupVTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(items.size())
                .build());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllRefundStatusLookup() {
        List<LookupVTO> items = Arrays.stream(RefundStatus.values())
                .map(financialMapper::toLookupVTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(items.size())
                .build());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllRentTypesLookup() {
        RentTypeSearchFilter filter = RentTypeSearchFilter.builder().build();

        List<RentType> rentTypes = rentTypeRepository.selectAllByFilters(filter);
        List<LookupVTO> items = financialMapper.toLookupRentTypeVTOs(rentTypes);

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(items.size())
                .build());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllSalaryTransactionTypesLookup() {
        List<LookupVTO> items = Arrays.stream(SalaryTransactionType.values())
                .map(financialMapper::toLookupVTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(items.size())
                .build());
    }

    @Override
    @Secured(value = {"ROLE_ADMIN","ROLE_SUPER_ADMIN"})
    public ResponseEntity<LookupResultSet> _getAllSalaryTypesLookup() {
        List<LookupVTO> items = Arrays.stream(SalaryTypes.values())
                .map(financialMapper::toLookupVTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(LookupResultSet.builder()
                ._list(items)
                .total(items.size())
                .build());
    }
}