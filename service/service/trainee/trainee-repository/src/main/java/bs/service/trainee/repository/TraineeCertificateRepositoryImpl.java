package bs.service.trainee.repository;

import bs.lib.security.api.service.SecurityUtilsService;
import bs.service.trainee.api.repository.TraineeCertificateRepository;
import bs.service.trainee.model.entity.TraineeCertificate;
import bs.service.trainee.model.filter.TraineeCertificateSearchFilter;
import bs.service.trainee.repository.jpa.TraineeCertificateJPARepository;
import bs.service.trainee.repository.query.TraineeCertificateQueryBuilder;
import bs.service.user.model.entity.User;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@AllArgsConstructor
public class TraineeCertificateRepositoryImpl implements TraineeCertificateRepository {

    private final TraineeCertificateJPARepository traineeCertificateJPARepository;
    private final SecurityUtilsService securityUtilsService;
    private final TraineeCertificateQueryBuilder queryBuilder;

    @Override
    public TraineeCertificate insert(TraineeCertificate traineeCertificate) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        traineeCertificate.setCreatedBy(currentUser);
        traineeCertificate.setCreatedOn(LocalDateTime.now());
        traineeCertificate.setIsDeleted(false);
        return traineeCertificateJPARepository.save(traineeCertificate);
    }

    @Override
    public TraineeCertificate update(TraineeCertificate traineeCertificate) {
        User currentUser = User.builder().id(securityUtilsService.getCurrentUserId()).build();
        traineeCertificate.setLastModifiedBy(currentUser);
        traineeCertificate.setLastModifiedOn(LocalDateTime.now());
        return traineeCertificateJPARepository.save(traineeCertificate);
    }

    @Override
    public Optional<TraineeCertificate> selectById(Integer id) {
        return traineeCertificateJPARepository.findById(id);
    }

    @Override
    public List<TraineeCertificate> selectAllByFilters(TraineeCertificateSearchFilter filters) {
        return queryBuilder.selectAllByFilters(filters);
    }

    @Override
    public Integer countAllByFilters(TraineeCertificateSearchFilter filters) {
        return queryBuilder.countAllByFilters(filters);
    }

    @Override
    public void deleteById(Integer id) {
        traineeCertificateJPARepository.deleteById(id);
    }
}