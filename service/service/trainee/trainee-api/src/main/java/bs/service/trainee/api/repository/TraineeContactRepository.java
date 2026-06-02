package bs.service.trainee.api.repository;

import bs.service.trainee.model.entity.TraineeContact;
import bs.service.trainee.model.filter.TraineeContactSearchFilter;

import java.util.List;
import java.util.Optional;

public interface TraineeContactRepository {

     TraineeContact insert(TraineeContact traineeContact);

     TraineeContact update(TraineeContact traineeContact);

     Optional<TraineeContact> selectById(Integer id);

     List<TraineeContact> selectAllByFilters(TraineeContactSearchFilter filters);

     Integer countAllByFilters(TraineeContactSearchFilter filters) ;

     void deleteById(Integer traineeContactId);
}
