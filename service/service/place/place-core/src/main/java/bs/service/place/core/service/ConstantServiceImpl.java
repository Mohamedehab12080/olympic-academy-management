package bs.service.place.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.LookupResultSet;
import bs.lib.common.model.generated.LookupVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.place.api.repository.ConstantRepository;
import bs.service.place.api.service.ConstantService;
import bs.service.place.core.mapper.PlaceMapper;
import bs.service.place.model.entity.Constant;
import bs.service.place.model.filter.ConstantSearchFilter;
import bs.service.place.model.generated.ConstantDTO;
import bs.service.place.model.generated.ConstantListItem;
import bs.service.place.model.generated.ConstantResultSet;
import bs.service.place.model.generated.ConstantVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static bs.service.place.model.enums.PlaceErrors.CONSTANT_ALREADY_EXIST;
import static bs.service.place.model.enums.PlaceErrors.CONSTANT_NOT_FOUND;

@Service
@AllArgsConstructor
public class ConstantServiceImpl implements ConstantService {

    private final ConstantRepository constantRepository;
    private final PlaceMapper mapper;


    @Override
    @Transactional
    public NewRecordVTO createConstant(ConstantDTO constantDTO) {
        List<Constant> constants=constantRepository.selectAllByFilters(ConstantSearchFilter.builder().value(constantDTO.getValue()).location(constantDTO.getLocation()).build());
        if(constants!=null && !constants.isEmpty()){
            throw new BusinessException(CONSTANT_ALREADY_EXIST);
        }
        Constant constant=mapper.toConstant(constantDTO);
        constant.setCreatedOn(LocalDateTime.now());
        constant=constantRepository.insert(constant);
        return NewRecordVTO.builder().id(constant.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateConstant(Integer constantId, ConstantDTO constantDTO) {
        Constant constant=constantRepository.selectById(constantId).orElseThrow(()-> new BusinessException(CONSTANT_NOT_FOUND,constantId));
        constant.setCreatedOn(LocalDateTime.now());
        constant=constantRepository.update(constant);
        return NewRecordVTO.builder().id(constant.getId()).build();
    }

    @Override
    @Transactional
    public void deleteConstantById(Integer constantId) {
        constantRepository.deleteById(constantId);
    }

    @Override
    public ConstantVTO getConstantById(Integer constantId) {
        Constant constant=constantRepository.selectById(constantId).orElseThrow(()-> new BusinessException(CONSTANT_NOT_FOUND,constantId));
        return mapper.toConstantVTO(constant);
    }

    @Override
    public ConstantResultSet getAllConstantsByFilter(String value, String location, String position, String quickSearch, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy) {

        ConstantSearchFilter constantSearchFilter=ConstantSearchFilter.builder()
                .value(value)
                .location(location)
                .position(position)
                .quickSearchQuery(quickSearch)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .build();

        List<Constant> constants=constantRepository.selectAllByFilters(constantSearchFilter);
        List<ConstantListItem> constantListItems=mapper.toConstantListItems(constants);
        return ConstantResultSet.builder().items(constantListItems).total(constantRepository.countAllByFilters(constantSearchFilter)).build();
    }

    @Override
    public LookupResultSet getAllConstantsLookup() {
        ConstantSearchFilter constantSearchFilter=ConstantSearchFilter.builder()
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Constant> constants=constantRepository.selectAllByFilters(constantSearchFilter);
        List<LookupVTO> lookupVTOS=mapper.toConstantLookupVTOs(constants);
        return LookupResultSet.builder()._list(lookupVTOS).total(constantRepository.countAllByFilters(constantSearchFilter)).build();
    }
}
