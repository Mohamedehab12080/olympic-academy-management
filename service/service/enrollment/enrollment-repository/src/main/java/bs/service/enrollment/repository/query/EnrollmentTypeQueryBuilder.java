package bs.service.enrollment.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.enrollment.model.entity.EnrollmentType;
import bs.service.enrollment.model.filter.EnrollmentTypeSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EnrollmentTypeQueryBuilder extends AbstractQueryBuilderV2<EnrollmentType, EnrollmentTypeSearchFilter> {

    public EnrollmentTypeQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EnrollmentTypeSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("title").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("LOWER(item.title) LIKE LOWER(:PH)").build());

        return qbConditions;
    }
}