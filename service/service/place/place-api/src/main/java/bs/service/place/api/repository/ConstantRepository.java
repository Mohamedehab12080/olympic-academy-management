package bs.service.place.api.repository;

import bs.service.place.model.entity.Constant;
import bs.service.place.model.filter.ConstantSearchFilter;

import java.util.List;
import java.util.Optional;

public interface ConstantRepository {
    Constant insert(Constant constant);
    Constant update(Constant constant);
    Optional<Constant> selectById(Integer id);
    List<Constant> selectAllByFilters(ConstantSearchFilter filters);
    Integer countAllByFilters(ConstantSearchFilter filters);
    void deleteById(Integer constantId);
}
