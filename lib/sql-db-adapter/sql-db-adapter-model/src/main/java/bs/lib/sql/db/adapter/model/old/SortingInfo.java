package bs.lib.sql.db.adapter.model.old;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SortingInfo {
    private String by;
    private OrderDirections dir;
}
