package bs.service.enrollment.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.api.repository.EnrollmentTypeRepository;
import bs.service.enrollment.api.service.EnrollmentTypeService;
import bs.service.enrollment.core.mapper.EnrollmentMapper;
import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.filter.EnrollmentTypeSearchFilter;
import bs.service.enrollment.model.generated.EnrollmentTypeDTO;
import bs.service.enrollment.model.generated.EnrollmentTypeResultSet;
import bs.service.enrollment.model.generated.EnrollmentTypeVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.enrollment.model.enums.EnrollmentErrors.ENROLLMENT_TYPE_NOT_FOUND;

@Service
@AllArgsConstructor
public class EnrollmentTypeServiceImpl implements EnrollmentTypeService {

    private final EnrollmentTypeRepository enrollmentTypeRepository;
    private final EnrollmentMapper enrollmentMapper;

    @Override
    @Transactional
    public NewRecordVTO createEnrollmentType(EnrollmentTypeDTO enrollmentTypeDTO) {
        EnrollmentType enrollmentType = enrollmentMapper.toEnrollmentType(enrollmentTypeDTO);
        enrollmentType = enrollmentTypeRepository.insert(enrollmentType);
        return NewRecordVTO.builder().id(enrollmentType.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateEnrollmentType(Integer enrollmentTypeId, EnrollmentTypeDTO enrollmentTypeDTO) {
        EnrollmentType enrollmentType = enrollmentTypeRepository.selectById(enrollmentTypeId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_TYPE_NOT_FOUND, enrollmentTypeId));
        EnrollmentType typeToUpdate = enrollmentMapper.toEnrollmentType(enrollmentTypeDTO);
        typeToUpdate.setId(enrollmentTypeId);
        enrollmentTypeRepository.update(typeToUpdate);
        return NewRecordVTO.builder().id(enrollmentTypeId).build();
    }

    @Override
    @Transactional
    public void deleteEnrollmentType(Integer enrollmentTypeId) {
        EnrollmentType enrollmentType = enrollmentTypeRepository.selectById(enrollmentTypeId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_TYPE_NOT_FOUND, enrollmentTypeId));
        enrollmentType.setIsDeleted(true);
        enrollmentTypeRepository.update(enrollmentType);
    }

    @Override
    public EnrollmentTypeVTO getEnrollmentTypeById(Integer enrollmentTypeId) {
        EnrollmentType enrollmentType = enrollmentTypeRepository.selectById(enrollmentTypeId)
                .orElseThrow(() -> new BusinessException(ENROLLMENT_TYPE_NOT_FOUND, enrollmentTypeId));
        return enrollmentMapper.toEnrollmentTypeVTO(enrollmentType);
    }

    @Override
    public EnrollmentTypeResultSet getAllEnrollmentTypes(String quickSearch, Integer pageNum, Integer pageSize,
                                                         OrderDirections orderDir, String orderBy) {
        EnrollmentTypeSearchFilter filter = EnrollmentTypeSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(EnrollmentTypeSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<EnrollmentType> types = enrollmentTypeRepository.selectAllByFilters(filter);
        List<EnrollmentTypeVTO> items = enrollmentMapper.toEnrollmentTypeVTOs(types);

        return EnrollmentTypeResultSet.builder()
                .items(items)
                .total(enrollmentTypeRepository.countAllByFilters(filter))
                .build();
    }
}