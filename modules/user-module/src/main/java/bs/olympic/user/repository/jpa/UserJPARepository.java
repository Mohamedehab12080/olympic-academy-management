package bs.olympic.user.repository.jpa;

import bs.olympic.common.repository.jpa.BaseJPARepository;
import bs.olympic.user.model.entity.User;
import bs.olympic.user.model.enums.Role;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserJPARepository extends BaseJPARepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    Optional<User> findByEmailAndIsActive(String email, boolean active);

    List<User> findByRole(Role role);
}
