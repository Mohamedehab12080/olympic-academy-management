package bs.olympic.common.api.repository;

import java.util.List;
import java.util.Optional;

public interface BaseRepository<T, ID> {
    Optional<T> selectById(ID id);
    List<T> selectAll();
    void deleteById(ID id);
    boolean existsById(ID id);
    long count();
}
