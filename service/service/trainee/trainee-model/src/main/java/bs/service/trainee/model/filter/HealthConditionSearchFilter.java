package bs.service.trainee.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class HealthConditionSearchFilter extends SearchFilter<HealthConditionSearchFilter.OrderByAttributes> {

    private Integer traineeId;
    private String quickSearchQuery;
    private String medication;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        TITLE("item.title", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}