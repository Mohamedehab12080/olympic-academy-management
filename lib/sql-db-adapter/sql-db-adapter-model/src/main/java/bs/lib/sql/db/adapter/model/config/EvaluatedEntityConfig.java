package bs.lib.sql.db.adapter.model.config;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluatedEntityConfig {
    private List<String> uniqueAttributes;
    private List<String> nonUpdateAttributes;
}
