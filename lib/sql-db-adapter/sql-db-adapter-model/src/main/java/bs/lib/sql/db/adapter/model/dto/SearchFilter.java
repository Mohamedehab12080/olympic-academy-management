package bs.lib.sql.db.adapter.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;

@Data
@SuperBuilder
@AllArgsConstructor
@NoArgsConstructor
public abstract class SearchFilter<S extends Enum<S> & OrderAttributes> {
    @Builder.Default
    private PaginationInfo pagination = PaginationInfo.builder().build();
    private SortingInfo<S> sorting;
    private SortingInfo<S> defaultSorting;
}
