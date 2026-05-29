package bs.lib.sql.db.adapter.model.old;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class SearchFilter {
    @Builder.Default
    private PaginationInfo pagination = PaginationInfo.builder().build();
    private SortingInfo sorting;
}
