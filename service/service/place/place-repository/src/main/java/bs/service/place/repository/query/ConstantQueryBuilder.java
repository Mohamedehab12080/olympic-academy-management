package bs.service.place.repository.query;


import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.place.model.entity.Constant;
import bs.service.place.model.filter.ConstantSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ConstantQueryBuilder extends AbstractQueryBuilderV2<Constant, ConstantSearchFilter> {

    public ConstantQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(ConstantSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty()) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("quickSearch")
                    .value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.title) LIKE LOWER(:PH))")
                    .build());
        }

        if (filters.getValue() != null && !filters.getValue().trim().isEmpty()) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("value")
                    .value("%" + filters.getValue() + "%")
                    .condition("(LOWER(item.value) LIKE LOWER(:PH))")
                    .build());
        }

        if (filters.getLocation() != null && !filters.getLocation().trim().isEmpty()) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("location")
                    .value("%" + filters.getLocation() + "%")
                    .condition("(LOWER(item.location) LIKE LOWER(:PH))")
                    .build());
        }

        if (filters.getPosition() != null && !filters.getPosition().trim().isEmpty()) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("position")
                    .value("%" + filters.getPosition() + "%")
                    .condition("(LOWER(item.position) LIKE LOWER(:PH))")
                    .build());
        }

        return qbConditions;
    }
}