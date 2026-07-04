package bs.service.trainee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.trainee.api.repository.TraineeRepository;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.filter.TraineeSearchFilter;
import bs.service.trainee.repository.jpa.TraineeJPARepository;
import bs.service.trainee.repository.query.TraineeQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class TraineeRepositoryImpl implements TraineeRepository {

    private final TraineeJPARepository traineeJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final TraineeQueryBuilder queryBuilder;

    @Override
    public Trainee insert(Trainee trainee) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        trainee.setCreatedBy(currentUser);
        trainee.setCreatedOn(LocalDateTime.now());
        trainee.setIsDeleted(false);
        trainee.setIsActive(true);
        return traineeJPARepository.save(trainee);
    }

    @Override
    public Trainee update(Trainee trainee) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        trainee.setLastModifiedBy(currentUser);
        trainee.setLastModifiedOn(LocalDateTime.now());
        return traineeJPARepository.save(trainee);
    }

    @Override
    public Optional<Trainee> selectById(Integer id) {
        return traineeJPARepository.findById(id);
    }

    @Override
    public List<Trainee> selectAllByFilters(TraineeSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(TraineeSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer id) {
        traineeJPARepository.deleteById(id);
    }
}