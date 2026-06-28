package bs.service.place.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.place.api.repository.ConstantRepository;
import bs.service.place.model.entity.Constant;
import bs.service.place.model.filter.ConstantSearchFilter;
import bs.service.place.repository.jpa.ConstantJPARepository;
import bs.service.place.repository.query.ConstantQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class ConstantRepositoryImpl implements ConstantRepository {

    private final SecurityUtilsService securityUtilsService;
    private final ConstantJPARepository constantJPARepository;
    private final ConstantQueryBuilder constantQueryBuilder;

    @Override
    public Constant insert(Constant constant) {
        User currentUser=User.builder().id(securityUtilsService.getCurrentUserId()).build();
        constant.setCreatedBy(currentUser);
        constant.setCreatedOn(LocalDateTime.now());
        return constantJPARepository.save(constant);
    }

    @Override
    public Constant update(Constant constant) {
        User currentUser=User.builder().id(securityUtilsService.getCurrentUserId()).build();
        constant.setCreatedBy(currentUser);
        return constantJPARepository.save(constant);
    }

    @Override
    public Optional<Constant> selectById(Integer id) {
        return constantJPARepository.findById(id);
    }

    @Override
    public List<Constant> selectAllByFilters(ConstantSearchFilter filters) {
        return constantQueryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(ConstantSearchFilter filters) {
        return constantQueryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer constantId) {
        constantJPARepository.deleteById(constantId);
    }
}
