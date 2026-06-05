package bs.service.financial.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.repository.ExpenseTypeRepository;
import bs.service.financial.api.service.ExpenseTypeService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.expense.ExpenseType;
import bs.service.financial.model.filter.ExpenseTypeSearchFilter;
import bs.service.financial.model.generated.ExpenseTypeDTO;
import bs.service.financial.model.generated.ExpenseTypeResultSet;
import bs.service.financial.model.generated.ExpenseTypeVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.EXPENSE_TYPE_NOT_FOUND;

@Service
@AllArgsConstructor
public class ExpenseTypeServiceImpl implements ExpenseTypeService {

    private final ExpenseTypeRepository expenseTypeRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createExpenseType(ExpenseTypeDTO expenseTypeDTO) {
        ExpenseType expenseType = financialMapper.toExpenseType(expenseTypeDTO);
        expenseType = expenseTypeRepository.insert(expenseType);
        return NewRecordVTO.builder().id(expenseType.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateExpenseType(Integer expenseTypeId, ExpenseTypeDTO expenseTypeDTO) {
        ExpenseType expenseType = expenseTypeRepository.selectById(expenseTypeId)
                .orElseThrow(() -> new BusinessException(EXPENSE_TYPE_NOT_FOUND, expenseTypeId));
        ExpenseType typeToUpdate = financialMapper.toExpenseType(expenseTypeDTO);
        typeToUpdate.setId(expenseTypeId);
        expenseTypeRepository.update(typeToUpdate);
        return NewRecordVTO.builder().id(expenseTypeId).build();
    }

    @Override
    @Transactional
    public void deleteExpenseType(Integer expenseTypeId) {
        ExpenseType expenseType = expenseTypeRepository.selectById(expenseTypeId)
                .orElseThrow(() -> new BusinessException(EXPENSE_TYPE_NOT_FOUND, expenseTypeId));
        expenseType.setIsDeleted(true);
        expenseTypeRepository.update(expenseType);
    }

    @Override
    public ExpenseTypeVTO getExpenseTypeById(Integer expenseTypeId) {
        ExpenseType expenseType = expenseTypeRepository.selectById(expenseTypeId)
                .orElseThrow(() -> new BusinessException(EXPENSE_TYPE_NOT_FOUND, expenseTypeId));
        return financialMapper.toExpenseTypeVTO(expenseType);
    }

    @Override
    public ExpenseTypeResultSet getAllExpenseTypes(String quickSearch, Boolean isActive, Integer pageNum,
                                                   Integer pageSize, OrderDirections orderDir, String orderBy) {
        ExpenseTypeSearchFilter filter = ExpenseTypeSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .isActive(isActive)
                .isDeleted(false)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(ExpenseTypeSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<ExpenseType> types = expenseTypeRepository.selectAllByFilters(filter);
        List<ExpenseTypeVTO> items = financialMapper.toExpenseTypeVTOs(types);

        return ExpenseTypeResultSet.builder()
                .items(items)
                .total(expenseTypeRepository.countAllByFilters(filter))
                .build();
    }
}