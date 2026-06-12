package bs.service.file.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import bs.service.file.model.entity.FlFile;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public interface FileJPARepository extends JpaRepository<FlFile, Long> {

    Optional<FlFile> findByFid(String fid);

}
