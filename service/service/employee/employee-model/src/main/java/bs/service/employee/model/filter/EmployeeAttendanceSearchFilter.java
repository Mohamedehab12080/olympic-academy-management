package bs.service.employee.model.filter;

import bs.lib.sql.db.adapter.model.dto.SearchFilter;
import bs.lib.sql.db.adapter.model.interfaces.OrderAttributes;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeAttendanceSearchFilter extends SearchFilter<EmployeeAttendanceSearchFilter.OrderByAttributes> {

    private Integer employeeId;
    private String status;
    private LocalDate attendanceDateFrom;
    private LocalDate attendanceDateTo;
    private LocalTime checkInFrom;
    private LocalTime checkInTo;
    private LocalTime checkOutFrom;
    private LocalTime checkOutTo;


    @Getter
    @AllArgsConstructor
    public enum OrderByAttributes implements OrderAttributes {
        ATTENDANCE_DATE("item.attendanceDate", false),
        CREATION_DATE("item.createdOn", false);

        private final String attributeName;
        private final Boolean isLocalized;
    }
}