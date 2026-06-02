package bs.service.trainee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.trainee.model.entity.TraineeContact;
import bs.service.trainee.model.filter.TraineeContactSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TraineeContactQueryBuilder extends AbstractQueryBuilderV2<TraineeContact, TraineeContactSearchFilter> {

    public TraineeContactQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(TraineeContactSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getTraineeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("traineeId").value(filters.getTraineeId())
                    .condition("item.trainee.id = :PH").build());

        if (filters.getContactValue() != null)
            qbConditions.add(QBCondition.builder().placeHolder("contactValue").value("%"+filters.getContactValue()+"%")
                    .condition("item.contactValue Like :PH").build());

        return qbConditions;
    }
}