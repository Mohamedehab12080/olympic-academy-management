package bs.service.place.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.place.model.entity.Place;
import bs.service.place.model.filter.PlaceSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PlaceQueryBuilder extends AbstractQueryBuilderV2<Place, PlaceSearchFilter> {

    public PlaceQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(PlaceSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty()) {
            qbConditions.add(QBCondition.builder()
                    .placeHolder("quickSearch")
                    .value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.title) LIKE LOWER(:PH) OR LOWER(item.address) LIKE LOWER(:PH) OR item.phoneNumber LIKE :PH)")
                    .build());
        }

        return qbConditions;
    }
}