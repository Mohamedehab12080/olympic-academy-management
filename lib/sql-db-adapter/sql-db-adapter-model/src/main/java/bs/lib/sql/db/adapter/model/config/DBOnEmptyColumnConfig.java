package bs.lib.sql.db.adapter.model.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import bs.lib.sql.db.adapter.model.enums.SQLDatabaseEvents;

import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DBOnEmptyColumnConfig {

   private Map<SQLDatabaseEvents, String> setValueFromContext;
   private Map<SQLDatabaseEvents, Object> setDefaultValue;
   private Map<SQLDatabaseEvents, String> setValueFromAnotherAttribute;
}
