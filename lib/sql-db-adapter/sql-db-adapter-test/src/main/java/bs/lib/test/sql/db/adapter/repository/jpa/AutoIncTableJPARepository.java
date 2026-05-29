package bs.lib.test.sql.db.adapter.repository.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import bs.lib.test.sql.db.adapter.model.entity.AutoIncTable;

@Repository
public interface AutoIncTableJPARepository extends JpaRepository<AutoIncTable,Integer> {

}
