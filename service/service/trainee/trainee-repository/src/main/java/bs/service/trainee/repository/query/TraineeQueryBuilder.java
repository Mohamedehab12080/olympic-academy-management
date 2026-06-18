package bs.service.trainee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.trainee.model.entity.Trainee;
import bs.service.trainee.model.filter.TraineeSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TraineeQueryBuilder extends AbstractQueryBuilderV2<Trainee, TraineeSearchFilter> {

    public TraineeQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(TraineeSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("fullName").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.fullName) LIKE LOWER(:PH) OR item.nationalId LIKE :PH)").build());

        if (filters.getIsDeleted() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isDeleted").value(filters.getIsDeleted())
                    .condition("item.isDeleted = :PH").build());

        if (filters.getIsActive() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isActive").value(filters.getIsActive())
                    .condition("item.isActive = :PH").build());

        if (filters.getGender() != null)
            qbConditions.add(QBCondition.builder().placeHolder("gender").value(filters.getGender())
                    .condition("item.gender = :PH").build());

        if (filters.getAcademicYear() != null && !filters.getAcademicYear().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("academicYear").value(filters.getAcademicYear())
                    .condition("item.academicYear = :PH").build());

        if (filters.getCreatedOnFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnFrom").value(filters.getCreatedOnFrom())
                    .condition("item.createdOn >= :PH").build());

        if (filters.getCreatedOnTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("createdOnTo").value(filters.getCreatedOnTo().atStartOfDay())
                    .condition("item.createdOn <= :PH").build());

        return qbConditions;
    }
}