package bs.service.trainee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.trainee.api.repository.TraineeContactRepository;
import bs.service.trainee.model.entity.TraineeContact;
import bs.service.trainee.model.filter.TraineeContactSearchFilter;
import bs.service.trainee.repository.jpa.TraineeContactJPARepository;
import bs.service.trainee.repository.query.TraineeContactQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class TraineeContactRepositoryImpl implements TraineeContactRepository {

    private final TraineeContactJPARepository traineeContactJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final TraineeContactQueryBuilder queryBuilder;

    @Override
    public TraineeContact insert(TraineeContact traineeContact) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        traineeContact.setCreatedBy(currentUser);
        traineeContact.setCreatedOn(LocalDateTime.now());
        traineeContact.setIsDeleted(false);
        return traineeContactJPARepository.save(traineeContact);
    }

    @Override
    public TraineeContact update(TraineeContact traineeContact) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        traineeContact.setLastModifiedBy(currentUser);
        traineeContact.setLastModifiedOn(LocalDateTime.now());
        return traineeContactJPARepository.save(traineeContact);
    }

    @Override
    public Optional<TraineeContact> selectById(Integer id) {
        return traineeContactJPARepository.findById(id);
    }

    @Override
    public List<TraineeContact> selectAllByFilters(TraineeContactSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(TraineeContactSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer traineeContactId) {
        traineeContactJPARepository.deleteById(traineeContactId);
    }
}