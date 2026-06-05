package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.PaymentMethod;
import bs.service.financial.model.filter.PaymentMethodSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PaymentMethodQueryBuilder extends AbstractQueryBuilderV2<PaymentMethod, PaymentMethodSearchFilter> {

    public PaymentMethodQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(PaymentMethodSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("title").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("LOWER(item.title) LIKE LOWER(:PH)").build());

        return qbConditions;
    }
}