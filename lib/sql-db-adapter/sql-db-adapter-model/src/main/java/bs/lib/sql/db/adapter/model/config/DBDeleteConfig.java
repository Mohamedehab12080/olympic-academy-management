package bs.lib.sql.db.adapter.model.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import bs.lib.sql.db.adapter.model.enums.DBDeleteModes;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DBDeleteConfig {

    private DBDeleteModes mode;
}
