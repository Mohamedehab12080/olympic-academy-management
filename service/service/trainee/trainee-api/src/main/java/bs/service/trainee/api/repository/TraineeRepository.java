package bs.service.trainee.api.repository;

import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.filter.TraineeSearchFilter;

import java.util.List;
import java.util.Optional;

public interface TraineeRepository {

     Trainee insert(Trainee trainee);

     Trainee update(Trainee trainee);

     Optional<Trainee> selectById(Integer id) ;

     List<Trainee> selectAllByFilters(TraineeSearchFilter filters) ;

     Integer countAllByFilters(TraineeSearchFilter filters) ;

    void deleteById(Integer id);
}

