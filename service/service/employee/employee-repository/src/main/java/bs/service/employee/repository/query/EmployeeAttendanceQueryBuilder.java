package bs.service.employee.repository.query;

import bs.lib.sql.db.adapter.api.service.AbstractQueryBuilderV2;
import bs.lib.sql.db.adapter.model.dto.QBCondition;
import bs.service.employee.model.entity.EmployeeAttendance;
import bs.service.employee.model.filter.EmployeeAttendanceSearchFilter;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class EmployeeAttendanceQueryBuilder extends AbstractQueryBuilderV2<EmployeeAttendance, EmployeeAttendanceSearchFilter> {

    public EmployeeAttendanceQueryBuilder(EntityManager em) {
        super(em);
    }

    @Override
    public List<QBCondition> evaluateWhereConditions(EmployeeAttendanceSearchFilter filters) {
        List<QBCondition> qbConditions = new ArrayList<>();

        if (filters.getIsDeleted() != null)
            qbConditions.add(QBCondition.builder().placeHolder("isDeleted").value(filters.getIsDeleted())
                    .condition("item.isDeleted = :PH").build());


        if (filters.getQuickSearch() != null && !filters.getQuickSearch().trim().isEmpty())
            qbConditions.add(QBCondition.builder().placeHolder("quickSearch").value("%" + filters.getQuickSearch() + "%")
                    .condition("(LOWER(item.employee.fullName) LIKE LOWER(:PH))").build());

        if (filters.getEmployeeNationalId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("employeeNationalId").value(filters.getEmployeeNationalId())
                    .condition("item.employee.nationalId = :PH").build());


        if (filters.getEmployeeId() != null)
            qbConditions.add(QBCondition.builder().placeHolder("employeeId").value(filters.getEmployeeId())
                    .condition("item.employee.id = :PH").build());

        if (filters.getStatus() != null)
            qbConditions.add(QBCondition.builder().placeHolder("status").value(filters.getStatus())
                    .condition("item.status = :PH").build());

        if (filters.getAttendanceDateFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("attendanceDateFrom").value(filters.getAttendanceDateFrom())
                    .condition("item.attendanceDate >= :PH").build());

        if (filters.getAttendanceDateTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("attendanceDateTo").value(filters.getAttendanceDateTo())
                    .condition("item.attendanceDate <= :PH").build());

        if (filters.getCheckInFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("checkInFrom").value(filters.getCheckInFrom())
                    .condition("item.checkInTime >= :PH").build());

        if (filters.getCheckInTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("checkInTo").value(filters.getCheckInTo())
                    .condition("item.checkInTime <= :PH").build());

        if (filters.getCheckOutFrom() != null)
            qbConditions.add(QBCondition.builder().placeHolder("checkOutFrom").value(filters.getCheckOutFrom())
                    .condition("item.checkOutTime >= :PH").build());

        if (filters.getCheckOutTo() != null)
            qbConditions.add(QBCondition.builder().placeHolder("checkOutTo").value(filters.getCheckOutTo())
                    .condition("item.checkOutTime <= :PH").build());

        return qbConditions;
    }
}