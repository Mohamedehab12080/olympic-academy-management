package bs.service.trainee.repository.jpa;

import bs.service.trainee.model.entity.TraineeCertificate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TraineeCertificateJPARepository extends JpaRepository<TraineeCertificate, Integer> {
}