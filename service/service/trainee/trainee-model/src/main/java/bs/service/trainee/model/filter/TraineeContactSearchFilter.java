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
public class TraineeContactSearchFilter extends SearchFilter<TraineeContactSearchFilter.OrderByAttributes> {

    private Integer traineeId;
    private String contactValue;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        CONTACT_VALUE("item.contactValue", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}