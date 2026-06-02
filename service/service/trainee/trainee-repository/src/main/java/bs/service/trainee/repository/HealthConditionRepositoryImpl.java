package bs.service.trainee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.trainee.api.repository.HealthConditionRepository;
import bs.service.trainee.model.entity.HealthCondition;
import bs.service.trainee.model.filter.HealthConditionSearchFilter;
import bs.service.trainee.repository.jpa.HealthConditionJPARepository;
import bs.service.trainee.repository.query.HealthConditionQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class HealthConditionRepositoryImpl implements HealthConditionRepository {

    private final HealthConditionJPARepository healthConditionJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final HealthConditionQueryBuilder queryBuilder;

    @Override
    public HealthCondition insert(HealthCondition healthCondition) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        healthCondition.setCreatedBy(currentUser);
        healthCondition.setCreatedOn(LocalDateTime.now());
        healthCondition.setIsDeleted(false);
        return healthConditionJPARepository.save(healthCondition);
    }

    @Override
    public HealthCondition update(HealthCondition healthCondition) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        healthCondition.setLastModifiedBy(currentUser);
        healthCondition.setLastModifiedOn(LocalDateTime.now());
        return healthConditionJPARepository.save(healthCondition);
    }

    @Override
    public Optional<HealthCondition> selectById(Integer id) {
        return healthConditionJPARepository.findById(id);
    }

    @Override
    public List<HealthCondition> selectAllByFilters(HealthConditionSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(HealthConditionSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer healthConditionId) {
        healthConditionJPARepository.deleteById(healthConditionId);
    }
}