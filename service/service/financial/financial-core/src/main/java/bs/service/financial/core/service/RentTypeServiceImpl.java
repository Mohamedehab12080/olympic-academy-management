package bs.service.financial.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.financial.api.repository.RentTypeRepository;
import bs.service.financial.api.service.RentTypeService;
import bs.service.financial.core.mapper.FinancialMapper;
import bs.service.financial.model.entity.place.RentType;
import bs.service.financial.model.filter.RentTypeSearchFilter;
import bs.service.financial.model.generated.RentTypeDTO;
import bs.service.financial.model.generated.RentTypeResultSet;
import bs.service.financial.model.generated.RentTypeVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.financial.model.enums.FinancialErrors.RENT_TYPE_NOT_FOUND;

@Service
@AllArgsConstructor
public class RentTypeServiceImpl implements RentTypeService {

    private final RentTypeRepository rentTypeRepository;
    private final FinancialMapper financialMapper;

    @Override
    @Transactional
    public NewRecordVTO createRentType(RentTypeDTO rentTypeDTO) {
        RentType rentType = financialMapper.toRentType(rentTypeDTO);
        rentType = rentTypeRepository.insert(rentType);
        return NewRecordVTO.builder().id(rentType.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateRentType(Integer rentTypeId, RentTypeDTO rentTypeDTO) {
        RentType rentType = rentTypeRepository.selectById(rentTypeId)
                .orElseThrow(() -> new BusinessException(RENT_TYPE_NOT_FOUND, rentTypeId));
        RentType typeToUpdate = financialMapper.toRentType(rentTypeDTO);
        typeToUpdate.setId(rentTypeId);
        rentTypeRepository.update(typeToUpdate);
        return NewRecordVTO.builder().id(rentTypeId).build();
    }

    @Override
    @Transactional
    public void deleteRentType(Integer rentTypeId) {
        RentType rentType = rentTypeRepository.selectById(rentTypeId)
                .orElseThrow(() -> new BusinessException(RENT_TYPE_NOT_FOUND, rentTypeId));
        rentType.setIsDeleted(true);
        rentTypeRepository.update(rentType);
    }

    @Override
    public RentTypeVTO getRentTypeById(Integer rentTypeId) {
        RentType rentType = rentTypeRepository.selectById(rentTypeId)
                .orElseThrow(() -> new BusinessException(RENT_TYPE_NOT_FOUND, rentTypeId));
        return financialMapper.toRentTypeVTO(rentType);
    }

    @Override
    public RentTypeResultSet getAllRentTypes(String quickSearch, Integer pageNum, Integer pageSize,
                                             OrderDirections orderDir, String orderBy) {
        RentTypeSearchFilter filter = RentTypeSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(RentTypeSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<RentType> types = rentTypeRepository.selectAllByFilters(filter);
        List<RentTypeVTO> items = financialMapper.toRentTypeVTOs(types);

        return RentTypeResultSet.builder()
                .items(items)
                .total(rentTypeRepository.countAllByFilters(filter))
                .build();
    }
}