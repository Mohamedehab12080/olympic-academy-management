package bs.service.financial.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.financial.api.repository.RentTypeRepository;
import bs.service.financial.model.entity.place.RentType;
import bs.service.financial.model.filter.RentTypeSearchFilter;
import bs.service.financial.repository.jpa.RentTypeJPARepository;
import bs.service.financial.repository.query.RentTypeQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class RentTypeRepositoryImpl implements RentTypeRepository {

    private final RentTypeJPARepository rentTypeJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final RentTypeQueryBuilder queryBuilder;

    @Override
    public RentType insert(RentType rentType) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        rentType.setCreatedBy(currentUser);
        rentType.setCreatedOn(LocalDateTime.now());
        rentType.setIsDeleted(false);
        return rentTypeJPARepository.save(rentType);
    }

    @Override
    public RentType update(RentType rentType) {
        return rentTypeJPARepository.save(rentType);
    }

    @Override
    public Optional<RentType> selectById(Integer id) {
        return rentTypeJPARepository.findById(id);
    }

    @Override
    public List<RentType> selectAllByFilters(RentTypeSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(RentTypeSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }
}