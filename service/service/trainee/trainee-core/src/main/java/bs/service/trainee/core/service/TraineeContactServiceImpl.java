package bs.service.trainee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.service.trainee.api.repository.TraineeContactRepository;
import bs.service.trainee.api.repository.TraineeRepository;
import bs.service.trainee.api.service.TraineeContactService;
import bs.service.trainee.core.mapper.TraineeMapper;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.entity.TraineeContact;
import bs.service.trainee.model.filter.TraineeContactSearchFilter;
import bs.service.trainee.model.generated.TraineeContactDTO;
import bs.service.trainee.model.generated.TraineeContactListItem;
import bs.service.trainee.model.generated.TraineeContactResultSet;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static bs.service.trainee.model.enums.TraineeErrors.TRAINEE_CONTACT_NOT_FOUND;
import static bs.service.trainee.model.enums.TraineeErrors.TRAINEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class TraineeContactServiceImpl implements TraineeContactService {

    private final TraineeContactRepository traineeContactRepository;
    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;

    @Override
    @Transactional
    public NewRecordVTO createTraineeContact(Integer traineeId, TraineeContactDTO traineeContactDTO) {
        Trainee trainee = traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        TraineeContact contact = traineeMapper.toTraineeContact(traineeContactDTO);
        contact.setTrainee(trainee);
        contact = traineeContactRepository.insert(contact);

        return NewRecordVTO.builder().id(contact.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateTraineeContact(Integer traineeId, Integer contactId, TraineeContactDTO traineeContactDTO) {
        traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        TraineeContact contact = traineeContactRepository.selectById(contactId)
                .orElseThrow(() -> new BusinessException(TRAINEE_CONTACT_NOT_FOUND, contactId));

        TraineeContact contactToUpdate = traineeMapper.toTraineeContact(traineeContactDTO);
        contactToUpdate.setId(contactId);
        contactToUpdate.setTrainee(contact.getTrainee());
        traineeContactRepository.update(contactToUpdate);

        return NewRecordVTO.builder().id(contactId).build();
    }

    @Override
    @Transactional
    public void deleteTraineeContact(Integer traineeId, Integer contactId) {
        traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        TraineeContact contact = traineeContactRepository.selectById(contactId)
                .orElseThrow(() -> new BusinessException(TRAINEE_CONTACT_NOT_FOUND, contactId));
        traineeContactRepository.deleteById(contact.getId());
    }

    @Override
    public TraineeContactResultSet getTraineeContacts(Integer traineeId,String contactValue) {
        TraineeContactSearchFilter filter = TraineeContactSearchFilter.builder()
                .traineeId(traineeId)
                .contactValue(contactValue).pagination(PaginationInfo.noPagination())
                .build();

        List<TraineeContact> contacts = traineeContactRepository.selectAllByFilters(filter);
        List<TraineeContactListItem> items = traineeMapper.toTraineeContactListItems(contacts);

        return TraineeContactResultSet.builder()
                .items(items)
                .total(items.size())
                .build();
    }
}