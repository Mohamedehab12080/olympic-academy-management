package bs.service.trainee.model.filter;

import bs.lib.common.model.enums.Gender;
import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class TraineeSearchFilter extends SearchFilter<TraineeSearchFilter.OrderByAttributes> {

    private String quickSearchQuery;
    private Boolean isActive;
    private Boolean isDeleted;
    private Gender gender;
    private String academicYear;
    private LocalDate createdOnFrom;
    private LocalDate createdOnTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        FULL_NAME("item.fullName", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}