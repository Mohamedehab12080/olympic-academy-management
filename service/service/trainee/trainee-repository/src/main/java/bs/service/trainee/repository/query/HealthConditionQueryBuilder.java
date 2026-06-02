package bs.service.trainee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.trainee.model.entity.HealthCondition;
import bs.service.trainee.model.filter.HealthConditionSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class HealthConditionQueryBuilder extends AbstractQueryBuilderV2<HealthCondition, HealthConditionSearchFilter> {

    public HealthConditionQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(HealthConditionSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getTraineeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("traineeId").value(filters.getTraineeId())
                    .condition("item.trainee.id = :PH").build());

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("title").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.title) LIKE LOWER(:PH) OR LOWER(item.description) LIKE LOWER(:PH) OR LOWER(item.medication) LIKE LOWER(:PH))").build());

        if (filters.getMedication() != null && !filters.getMedication().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("medication").value(filters.getMedication())
                    .condition("item.medication = :PH").build());

        return qbConditions;
    }
}