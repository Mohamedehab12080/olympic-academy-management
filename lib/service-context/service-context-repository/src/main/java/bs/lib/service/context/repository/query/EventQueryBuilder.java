package bs.lib.service.context.repository.query;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import bs.lib.service.context.model.entity.SCEvent;
import bs.lib.service.context.model.filter.EventSearchFilter;
import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EventQueryBuilder extends AbstractQueryBuilderV2<SCEvent, EventSearchFilter> {

    public EventQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EventSearchFilter filters) {
        List<QBCondition> conditions = new ArrayList<>();

        return conditions;
    }
}