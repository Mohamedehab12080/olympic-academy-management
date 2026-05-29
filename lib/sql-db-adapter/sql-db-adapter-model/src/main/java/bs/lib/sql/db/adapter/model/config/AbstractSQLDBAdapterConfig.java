package bs.lib.sql.db.adapter.model.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AbstractSQLDBAdapterConfig  {
   private Map<String,DBEntityConfig> entities;
   private Map<String, EvaluatedEntityConfig> evaluatedEntities = new HashMap<>();
}
