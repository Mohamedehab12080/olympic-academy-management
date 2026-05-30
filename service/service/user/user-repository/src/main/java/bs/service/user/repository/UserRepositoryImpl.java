package bs.service.user.repository;

import bs.olympic.common.repository.BaseRepositoryImpl;
import bs.service.user.api.repository.UserRepository;
import bs.service.user.model.entity.User;
import bs.service.user.model.enums.Role;
import bs.service.user.repository.jpa.UserJPARepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class UserRepositoryImpl extends BaseRepositoryImpl<User,Long> implements UserRepository {

    private final UserJPARepository jpaRepository;

    public UserRepositoryImpl(UserJPARepository jpaRepository) {
        super(jpaRepository);
        this.jpaRepository = jpaRepository;
    }

    @Override
    public User insert(User user) {
        user.setCreatedOn(LocalDateTime.now());
        return jpaRepository.save(user);
    }

    @Override
    public void update(User user) {
        user.setLastModifiedOn(LocalDateTime.now());
        jpaRepository.save(user);
    }

    @Override
    public Optional<User> selectByEmail(String email) {
        return jpaRepository.findByEmail(email);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpaRepository.existsByEmail(email);
    }

    @Override
    public Optional<User> selectByEmailAndIsActive(String email, boolean isActive) {
        return jpaRepository.findByEmailAndIsActive(email, isActive);
    }

    @Override
    public List<User> selectByRole(Role role) {
        return jpaRepository.findByRole(role);
    }
}
