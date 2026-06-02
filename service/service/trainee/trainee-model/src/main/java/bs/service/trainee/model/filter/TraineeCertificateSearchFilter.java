package bs.service.trainee.model.filter;

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
public class TraineeCertificateSearchFilter extends SearchFilter<TraineeCertificateSearchFilter.OrderByAttributes> {

    private Integer traineeId;
    private Integer courseId;
    private String quickSearchQuery;
    private LocalDate issueDateFrom;
    private LocalDate issueDateTo;

    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        ISSUE_DATE("item.issueDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}