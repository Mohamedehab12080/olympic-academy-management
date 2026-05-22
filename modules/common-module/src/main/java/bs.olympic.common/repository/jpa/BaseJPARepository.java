package bs.olympic.common.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

@NoRepositoryBean
public interface BaseJPARepository<T, ID> extends JpaRepository<T, ID>, JpaSpecificationExecutor<T> {

}