package bs.lib.sql.db.adapter.model.enums;

import lombok.AllArgsConstructor;
import bs.lib.common.model.interfaces.Domains;

@AllArgsConstructor
public enum SQLDatabaseAdapterDomains implements Domains {
    QUERY_BUILDER(1201, null),
    DB_CONFIG(1202,null),
    ;

    private final Integer id;
    private final String destination;

    @Override
    public Integer id() {
        return id;
    }

    @Override
    public String destination() {
        return destination;
    }

}
