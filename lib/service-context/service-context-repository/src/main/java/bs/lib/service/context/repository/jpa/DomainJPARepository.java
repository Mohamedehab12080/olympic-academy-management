package bs.lib.service.context.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import bs.lib.service.context.model.entity.SCDomain;

@Repository
public interface DomainJPARepository extends JpaRepository<SCDomain, Integer> {

}