package bs.lib.test.sql.db.adapter.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import bs.lib.test.sql.db.adapter.model.entity.NonAutoIncTable;

@Repository
public interface NonAutoIncTableJPARepository extends JpaRepository<NonAutoIncTable,Integer> {

}
