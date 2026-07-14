package bs.service.financial.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.financial.model.entity.place.PlaceRentPayment;
import bs.service.financial.model.filter.PlaceRentPaymentSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class PlaceRentPaymentQueryBuilder extends AbstractQueryBuilderV2<PlaceRentPayment, PlaceRentPaymentSearchFilter> {

    public PlaceRentPaymentQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(PlaceRentPaymentSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getQuickSearch() != null && !filters.getQuickSearch().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("title").value("%" + filters.getQuickSearch() + "%")
                    .condition("LOWER(item.place.title) LIKE LOWER(:PH) OR item.id LIKE (:PH)").build());

        if (filters.getIsDeleted() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isDeleted").value(filters.getIsDeleted())
                    .condition("item.isDeleted = :PH").build());

        if (filters.getPlaceId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("placeId").value(filters.getPlaceId())
                    .condition("item.place.id = :PH").build());

        if (filters.getRentTypeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("rentTypeId").value(filters.getRentTypeId())
                    .condition("item.rentType.id = :PH").build());

        if (filters.getPaymentMethodId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentMethodId").value(filters.getPaymentMethodId())
                    .condition("item.paymentMethod.id = :PH").build());

        if (filters.getStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("status").value(filters.getStatus())
                    .condition("item.status = :PH").build());

        if (filters.getPaymentDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentDateFrom").value(filters.getPaymentDateFrom())
                    .condition("item.paymentDate >= :PH").build());

        if (filters.getPaymentDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("paymentDateTo").value(filters.getPaymentDateTo())
                    .condition("item.paymentDate <= :PH").build());

        return qbConditions;
    }
}