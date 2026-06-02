package bs.service.trainee.api.repository;

import bs.service.trainee.model.entity.TraineeCertificate;
import bs.service.trainee.model.filter.TraineeCertificateSearchFilter;

import java.util.List;
import java.util.Optional;

public interface TraineeCertificateRepository {

    TraineeCertificate insert(TraineeCertificate traineeCertificate);

    TraineeCertificate update(TraineeCertificate traineeCertificate);

    Optional<TraineeCertificate> selectById(Integer id);

    List<TraineeCertificate> selectAllByFilters(TraineeCertificateSearchFilter filters);

    Integer countAllByFilters(TraineeCertificateSearchFilter filters);

    void deleteById(Integer id);
}
