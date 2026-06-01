package bs.service.employee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.employee.model.entity.EmployeeContact;
import bs.service.employee.model.filter.EmployeeContactSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EmployeeContactQueryBuilder extends AbstractQueryBuilderV2<EmployeeContact, EmployeeContactSearchFilter> {

    public EmployeeContactQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EmployeeContactSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getContactName() != null && !filters.getContactName().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("contactName").value("%" + filters.getContactName() + "%")
                    .condition("(LOWER(item.contactName) LIKE LOWER(:PH))").build());

        if (filters.getContactValue() != null && !filters.getContactValue().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("contactValue").value("%" + filters.getContactValue() + "%")
                    .condition("(LOWER(item.contactValue) LIKE LOWER(:PH))").build());

        if (filters.getEmployeeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("employeeId").value(filters.getEmployeeId())
                    .condition("item.employeeId = :PH").build());
        return qbConditions;
    }
}