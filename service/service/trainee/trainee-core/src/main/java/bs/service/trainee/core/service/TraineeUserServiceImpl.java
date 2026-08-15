package bs.service.trainee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.CommonEnrollmentVTO;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.rest.model.enums.RESTErrors;
import bs.lib.security.api.service.SecurityUtilsService;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.service.enrollment.api.repository.EnrollmentRepository;
import bs.service.enrollment.model.filter.EnrollmentSearchFilter;
import bs.service.file.api.service.FileService;
import bs.service.trainee.api.repository.TraineeRepository;
import bs.service.trainee.api.service.TraineeUserService;
import bs.service.trainee.core.mapper.TraineeMapper;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.enums.TraineeDomains;
import bs.service.trainee.model.filter.TraineeSearchFilter;
import bs.service.trainee.model.generated.TraineeDTO;
import bs.service.trainee.model.generated.TraineeVTO;
import bs.service.user.model.entity.User;
import bs.service.user.model.enums.Role;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

import static bs.service.trainee.model.enums.TraineeErrors.NATIONAL_ID_ALREADY_EXISTS;
import static bs.service.trainee.model.enums.TraineeErrors.TRAINEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class TraineeUserServiceImpl implements TraineeUserService {

    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;
    private final FileService fileService;
    private final SecurityUtilsService securityUtilsService;
    private final EnrollmentRepository enrollmentRepository;

    @Override
    @Transactional
    public NewRecordVTO createTraineeUser(Integer traineeUserId, TraineeDTO traineeDTO) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        if(!traineeUserId.equals(currentUser.getId())) {
            if(currentUser.getRole().equals(Role.ROLE_TRAINEE)){
                throw new BusinessException(RESTErrors.UN_AUTHORIZED_REQ);
            }
        }
        TraineeSearchFilter traineeSearchFilter=TraineeSearchFilter.builder().quickSearchQuery(traineeDTO.getNationalId()).isDeleted(false).pagination(PaginationInfo.noPagination()).build();
        Trainee existsTrainee = traineeRepository.selectAllByFilters(traineeSearchFilter).stream().findFirst().orElse(null);
        if(existsTrainee!=null) {
            throw new BusinessException(NATIONAL_ID_ALREADY_EXISTS, existsTrainee.getNationalId());
        }
        Trainee trainee = traineeMapper.toTrainee(traineeDTO);
        trainee.setTraineeUser(currentUser);
        trainee = traineeRepository.insert(trainee);
        if(traineeDTO.getImageUrl()!=null){
            fileService.updateFileUsage(TraineeDomains.TRAINEE.id(),String.valueOf(trainee.getId()), Collections.singletonList(trainee.getImageUrl()));
        }
        return NewRecordVTO.builder().id(trainee.getId()).build();
    }


    @Override
    public TraineeVTO getTraineeUserById(Integer traineeUserId) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        TraineeSearchFilter traineeSearchFilter=TraineeSearchFilter.builder().traineeUserId(traineeUserId).isDeleted(false).isActive(true).pagination(PaginationInfo.noPagination()).build();
        Trainee trainee = traineeRepository.selectAllByFilters(traineeSearchFilter).stream().findFirst().orElseThrow(()->new BusinessException(TRAINEE_NOT_FOUND));
        if(!currentUser.getId().equals(trainee.getTraineeUser().getId())){
            throw new BusinessException(RESTErrors.UN_AUTHORIZED_REQ);
        }
        EnrollmentSearchFilter enrollmentSearchFilter=EnrollmentSearchFilter.builder().traineeId(trainee.getId()).pagination(PaginationInfo.noPagination()).build();
        List<CommonEnrollmentVTO> enrollmentVTOS=traineeMapper.toCommonEnrollmentVTOs(enrollmentRepository.selectAllByFilters(enrollmentSearchFilter));
        TraineeVTO traineeVTO=traineeMapper.toTraineeVTO(trainee);
        traineeVTO.setEnrollments(enrollmentVTOS);
        return traineeVTO;
    }

    @Override
    @Transactional
    public NewRecordVTO updateTraineeUser(Integer traineeUserId, TraineeDTO traineeDTO) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        if(!currentUser.getId().equals(traineeUserId) || !currentUser.getRole().equals(Role.ROLE_TRAINEE)){
            throw new BusinessException(RESTErrors.UN_AUTHORIZED_REQ);
        }
        TraineeSearchFilter traineeSearchFilter=TraineeSearchFilter.builder().traineeUserId(traineeUserId).isDeleted(false).isActive(true).pagination(PaginationInfo.noPagination()).build();
        Trainee trainee = traineeRepository.selectAllByFilters(traineeSearchFilter).stream().findFirst().orElseThrow(()->new BusinessException(TRAINEE_NOT_FOUND));
        Trainee traineeToUpdate = traineeMapper.toTrainee(traineeDTO);
        traineeToUpdate.setId(trainee.getId());
        traineeToUpdate.setCreatedBy(trainee.getCreatedBy());
        traineeToUpdate.setCreatedOn(trainee.getCreatedOn());
        traineeToUpdate.setTraineeUser(currentUser);
        traineeToUpdate.setIsActive(trainee.getIsActive());
        traineeToUpdate.setIsDeleted(trainee.getIsDeleted());
        traineeRepository.update(traineeToUpdate);
        if(traineeDTO.getImageUrl()!=null){
            fileService.updateFileUsage(TraineeDomains.TRAINEE.id(),String.valueOf(traineeToUpdate.getId()), Collections.singletonList(traineeToUpdate.getImageUrl()));
        }
        return NewRecordVTO.builder().id(trainee.getId()).build();
    }
}
