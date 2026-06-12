package bs.lib.service.context.repository.query;

import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;
import bs.lib.service.context.model.entity.SCDomain;
import bs.lib.service.context.model.filter.DomainSearchFilter;
import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;

import java.util.ArrayList;
import java.util.List;

@Repository
public class DomainQueryBuilder extends AbstractQueryBuilderV2<SCDomain, DomainSearchFilter> {

    public DomainQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(DomainSearchFilter filters) {
        List<QBCondition> conditions = new ArrayList<>();

        return conditions;
    }
}