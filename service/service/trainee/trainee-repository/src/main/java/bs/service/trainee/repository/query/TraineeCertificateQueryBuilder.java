package bs.service.trainee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.trainee.model.entity.TraineeCertificate;
import bs.service.trainee.model.filter.TraineeCertificateSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TraineeCertificateQueryBuilder extends AbstractQueryBuilderV2<TraineeCertificate, TraineeCertificateSearchFilter> {

    public TraineeCertificateQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(TraineeCertificateSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getTraineeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("traineeId").value(filters.getTraineeId())
                    .condition("item.trainee.id = :PH").build());

        if (filters.getCourseId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("courseId").value(filters.getCourseId())
                    .condition("item.course.id = :PH").build());

        if (filters.getQuickSearchQuery() != null && !filters.getQuickSearchQuery().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("certificateName").value("%" + filters.getQuickSearchQuery() + "%")
                    .condition("(LOWER(item.certificateName) LIKE LOWER(:PH) OR item.certificateNumber LIKE :PH)").build());

        if (filters.getIssueDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("issueDateFrom").value(filters.getIssueDateFrom())
                    .condition("item.issueDate >= :PH").build());

        if (filters.getIssueDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("issueDateTo").value(filters.getIssueDateTo())
                    .condition("item.issueDate <= :PH").build());

        return qbConditions;
    }
}