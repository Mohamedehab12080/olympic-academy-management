package bs.lib.sql.db.adapter.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum SQLDatabaseAdapterDomains implements Domains {
    QUERY_BUILDER(1201),
    DB_CONFIG(1202),
    ;

    private final Integer id;

    @Override
    public Integer id() {
        return id;
    }


}
