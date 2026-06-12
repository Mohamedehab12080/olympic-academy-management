package bs.lib.service.context.model.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.experimental.SuperBuilder;
import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;

@Data
@SuperBuilder
//@NoArgsConstructor
//@AllArgsConstructor
public class EventSearchFilter extends SearchFilter<EventSearchFilter.OrderByAttributes> {

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        ;
        private final String attributeName;
        private final Boolean isLocalized;
    }
}