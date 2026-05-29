package bs.lib.sql.db.adapter.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SQLDatabaseEvents {
    BEFORE_INSERT("Create"),
    BEFORE_UPDATE("Update"),
    ;

    private final String operation;
}
