package bs.service.trainee.core.service;

import bs.lib.common.model.exception.BusinessException;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.dto.PaginationInfo;
import bs.lib.sql.db.adapter.model.dto.SortingInfo;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.api.repository.TraineeCertificateRepository;
import bs.service.trainee.api.repository.TraineeRepository;
import bs.service.trainee.api.service.TraineeCertificateService;
import bs.service.trainee.core.mapper.TraineeMapper;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.entity.TraineeCertificate;
import bs.service.trainee.model.filter.TraineeCertificateSearchFilter;
import bs.service.trainee.model.generated.TraineeCertificateDTO;
import bs.service.trainee.model.generated.TraineeCertificateResultSet;
import bs.service.trainee.model.generated.TraineeCertificateVTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

import static bs.service.trainee.model.enums.TraineeErrors.CERTIFICATE_NOT_FOUND;
import static bs.service.trainee.model.enums.TraineeErrors.TRAINEE_NOT_FOUND;

@Service
@AllArgsConstructor
public class TraineeCertificateServiceImpl implements TraineeCertificateService {

    private final TraineeCertificateRepository traineeCertificateRepository;
    private final TraineeRepository traineeRepository;
    private final TraineeMapper traineeMapper;

    @Override
    @Transactional
    public NewRecordVTO createTraineeCertificate(Integer traineeId, TraineeCertificateDTO traineeCertificateDTO) {
        Trainee trainee = traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        TraineeCertificate certificate = traineeMapper.toTraineeCertificate(traineeCertificateDTO);
        certificate.setTrainee(trainee);
        certificate = traineeCertificateRepository.insert(certificate);

        return NewRecordVTO.builder().id(certificate.getId()).build();
    }

    @Override
    @Transactional
    public NewRecordVTO updateTraineeCertificate(Integer traineeId, Integer certificateId, TraineeCertificateDTO traineeCertificateDTO) {
        traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        TraineeCertificate certificate = traineeCertificateRepository.selectById(certificateId)
                .orElseThrow(() -> new BusinessException(CERTIFICATE_NOT_FOUND, certificateId));

        TraineeCertificate certToUpdate = traineeMapper.toTraineeCertificate(traineeCertificateDTO);
        certToUpdate.setId(certificateId);
        certToUpdate.setTrainee(certificate.getTrainee());
        traineeCertificateRepository.update(certToUpdate);

        return NewRecordVTO.builder().id(certificateId).build();
    }

    @Override
    @Transactional
    public void deleteTraineeCertificate(Integer traineeId, Integer certificateId) {
        traineeRepository.selectById(traineeId)
                .orElseThrow(() -> new BusinessException(TRAINEE_NOT_FOUND, traineeId));

        TraineeCertificate certificate = traineeCertificateRepository.selectById(certificateId)
                .orElseThrow(() -> new BusinessException(CERTIFICATE_NOT_FOUND, certificateId));
        traineeCertificateRepository.deleteById(certificate.getId());
    }

    @Override
    public TraineeCertificateResultSet getAllTraineeCertificatesByFilter(Integer traineeId, Integer courseId,
                                                                         String quickSearch, LocalDate issueDateFrom,
                                                                         LocalDate issueDateTo, Integer pageNum,
                                                                         Integer pageSize, OrderDirections orderDir,
                                                                         String orderBy) {
        TraineeCertificateSearchFilter filter = TraineeCertificateSearchFilter.builder()
                .traineeId(traineeId)
                .courseId(courseId)
                .quickSearchQuery(quickSearch)
                .issueDateFrom(issueDateFrom)
                .issueDateTo(issueDateTo)
                .pagination(PaginationInfo.builder().pageNum(pageNum).pageSize(pageSize).build())
                .defaultSorting(new SortingInfo<>(TraineeCertificateSearchFilter.OrderByAttributes.ISSUE_DATE, OrderDirections.DESC))
                .sorting(new SortingInfo<>(orderBy, orderDir))
                .build();

        List<TraineeCertificate> certificates = traineeCertificateRepository.selectAllByFilters(filter);
        List<TraineeCertificateVTO> items = traineeMapper.toTraineeCertificateVTOs(certificates);

        return TraineeCertificateResultSet.builder()
                .items(items)
                .total(items.size())
                .build();
    }
}