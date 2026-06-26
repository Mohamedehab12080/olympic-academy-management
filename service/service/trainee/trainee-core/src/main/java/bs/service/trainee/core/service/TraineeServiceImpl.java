package bs.service.trainee.core.service;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.CommonEnrollmentVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.file.api.service.FileService;
import bs.service.trainee.api.repository.TraineeRepository;
import bs.service.trainee.api.service.TraineeService;
import bs.service.trainee.core.mapper.TraineeMapper;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.enums.AcademicYear;
import bs.service.trainee.model.enums.TraineeDomains;
import bs.service.trainee.model.filter.TraineeSearchFilter;
import bs.service.trainee.model.generated.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Collections;
import java.util.List;

import static bs.service.trainee.model.enums.TraineeErrors.NATIONAL_ID_ALREADY_EXISTS;
import static bs.service.trainee.model.enums.TraineeErrors.TRAINEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class TraineeServiceImpl implements TraineeService {

    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;
    private final FileService fileService;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public NewRecordVTO createTrainee(TraineeDTO traineeDTO) {
        TraineeSearchFilter traineeSearchFilter=TraineeSearchFilter.builder().quickSearchQuery(traineeDTO.getNationalId()).pagination(PaginationInfo.noPagination()).build();
        Trainee existsTrainee = traineeRepository.selectAllByFilters(traineeSearchFilter).stream().findFirst().orElse(null);
        if(existsTrainee!=null) {
            throw new BusinessException(NATIONAL_ID_ALREADY_EXISTS, existsTrainee.getNationalId());
        }
        Trainee trainee = traineeMapper.toTrainee(traineeDTO);
        trainee = traineeRepository.insert(trainee);
        if(traineeDTO.getImageUrl()!=null){
            fileService.updateFileUsage(TraineeDomains.TRAINEE.id(),String.valueOf(trainee.getId()), Collections.singletonList(trainee.getImageUrl()));
        }
        return NewRecordVTO.builder().id(trainee.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateTrainee(Integer traineeId, TraineeDTO traineeDTO) {
        Trainee trainee = traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));
        Trainee traineeToUpdate = traineeMapper.toTrainee(traineeDTO);
        traineeToUpdate.setId(traineeId);
        traineeToUpdate.setCreatedBy(trainee.getCreatedBy());
        traineeToUpdate.setCreatedOn(trainee.getCreatedOn());
        traineeToUpdate.setIsActive(traineeDTO.getIsActive()!=null? traineeDTO.getIsActive():trainee.getIsActive());
        traineeToUpdate.setIsDeleted(false);
        traineeRepository.update(traineeToUpdate);
        if(traineeDTO.getImageUrl()!=null){
            fileService.updateFileUsage(TraineeDomains.TRAINEE.id(),String.valueOf(traineeToUpdate.getId()), Collections.singletonList(traineeToUpdate.getImageUrl()));
        }
        return NewRecordVTO.builder().id(traineeId).build();
    }

    @Override
    @Transactional
    public void deleteTraineeById(Integer traineeId) {
        Trainee trainee = traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));
        trainee.setIsDeleted(true);
        traineeRepository.update(trainee);
        fileService.deleteByFid(trainee.getImageUrl());
    }

    @Override
    public TraineeVTO getTraineeById(Integer traineeId) {
        Trainee trainee = traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));
        EnrollmentSearchFilter enrollmentSearchFilter=EnrollmentSearchFilter.builder().traineeId(trainee.getId()).pagination(PaginationInfo.noPagination()).build();
        List<CommonEnrollmentVTO> enrollmentVTOS=traineeMapper.toCommonEnrollmentVTOs(enrollmentRepository.selectAllByFilters(enrollmentSearchFilter));
        TraineeVTO traineeVTO=traineeMapper.toTraineeVTO(trainee);
        traineeVTO.setEnrollments(enrollmentVTOS);
        System.out.println("Trainee VTO : "+traineeVTO);
        return traineeVTO;
    }

    @Override
    public TraineeResultSet getAllTraineesByFilter(String quickSearch, Boolean isActive, Gender gender, String academicYear,
                                                   LocalDate createdOnFrom, LocalDate createdOnTo,
                                                   Integer pageNum, Integer pageSize,
                                                   OrderDirections orderDir, String orderBy) {
        TraineeSearchFilter filter = TraineeSearchFilter.builder()
                .quickSearchQuery(quickSearch)
                .gender(gender)
                .academicYear(academicYear)
                .createdOnFrom(createdOnFrom)
                .createdOnTo(createdOnTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TraineeSearchFilter.OrderByAttributes.CREATION_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();
        System.out.println("Sent page size  : "+pageSize);
        List<Trainee> trainees = traineeRepository.selectAllByFilters(filter);
        List<TraineeListItem> items = traineeMapper.toTraineeListItems(trainees);

        return TraineeResultSet.builder()
                .items(items)
                .total(traineeRepository.countAllByFilters(filter))
                .build();
    }

    @Override
    public TraineeLookupResultSet getAllTraineesLookup() {
        TraineeSearchFilter filter = TraineeSearchFilter.builder()
                .isActive(true)
                .isDeleted(false)
                .pagination(PaginationInfo.noPagination())
                .build();
        List<Trainee> trainees = traineeRepository.selectAllByFilters(filter);
        List<TraineeLookupVTO> traineeLookupVTOS = traineeMapper.toTraineeLookupVTOsFromTrainees(trainees);
        TraineeLookupResultSet traineeLookupResultSet = TraineeLookupResultSet.builder()
                ._list(traineeLookupVTOS)
                .total(traineeRepository.countAllByFilters(filter))
                .build();
        System.out.println("Trainee Lookup result set  : " + traineeLookupResultSet);
        return traineeLookupResultSet;
    }
}