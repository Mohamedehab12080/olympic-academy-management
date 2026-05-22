package bs.olympic.common.repository;

import bs.olympic.common.api.repository.BaseRepository;
import bs.olympic.common.repository.jpa.BaseJPARepository;
import lombok.RequiredArgsConstructor;

import java.util.List;
import java.util.Optional;


@RequiredArgsConstructor
public abstract class BaseRepositoryImpl<T, ID> implements BaseRepository<T, ID> {

    protected final BaseJPARepository<T, ID> jpaRepository;

    @Override
    public Optional<T> selectById(ID id) {
        return jpaRepository.findById(id);
    }

    @Override
    public List<T> selectAll() {
        return jpaRepository.findAll();
    }

    @Override
    public void deleteById(ID id) {
        jpaRepository.deleteById(id);
    }

    @Override
    public boolean existsById(ID id) {
        return jpaRepository.existsById(id);
    }

    @Override
    public long count() {
        return jpaRepository.count();
    }
}