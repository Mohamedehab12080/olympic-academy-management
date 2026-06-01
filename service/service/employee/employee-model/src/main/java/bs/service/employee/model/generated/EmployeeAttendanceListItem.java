package bs.service.employee.model.generated;

import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * EmployeeAttendanceListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeAttendanceListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LightUserVTO employee;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate attendanceDate;

    private EmployeeAttendanceStatus status;

    private String checkInTime;

    private String checkOutTime;

    private Integer lateTime;

    public EmployeeAttendanceListItem id(Integer id) {
        this.id = id;
        return this;
    }

    /**
     * Get id
     *
     * @return id
     */

    @Schema(name = "id", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("id")
    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public EmployeeAttendanceListItem employee(LightUserVTO employee) {
        this.employee = employee;
        return this;
    }

    /**
     * Get employee
     *
     * @return employee
     */
    @Valid
    @Schema(name = "employee", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("employee")
    public LightUserVTO getEmployee() {
        return employee;
    }

    public void setEmployee(LightUserVTO employee) {
        this.employee = employee;
    }

    public EmployeeAttendanceListItem attendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
        return this;
    }

    /**
     * Get attendanceDate
     *
     * @return attendanceDate
     */
    @Valid
    @Schema(name = "attendanceDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("attendanceDate")
    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public EmployeeAttendanceListItem status(EmployeeAttendanceStatus status) {
        this.status = status;
        return this;
    }

    /**
     * Get status
     *
     * @return status
     */
    @Valid
    @Schema(name = "status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("status")
    public EmployeeAttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeAttendanceStatus status) {
        this.status = status;
    }

    public EmployeeAttendanceListItem checkInTime(String checkInTime) {
        this.checkInTime = checkInTime;
        return this;
    }

    /**
     * Get checkInTime
     *
     * @return checkInTime
     */

    @Schema(name = "checkInTime", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("checkInTime")
    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }

    public EmployeeAttendanceListItem checkOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
        return this;
    }

    /**
     * Get checkOutTime
     *
     * @return checkOutTime
     */

    @Schema(name = "checkOutTime", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("checkOutTime")
    public String getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public EmployeeAttendanceListItem lateTime(Integer lateTime) {
        this.lateTime = lateTime;
        return this;
    }

    /**
     * Get lateTime
     *
     * @return lateTime
     */

    @Schema(name = "lateTime", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lateTime")
    public Integer getLateTime() {
        return lateTime;
    }

    public void setLateTime(Integer lateTime) {
        this.lateTime = lateTime;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EmployeeAttendanceListItem employeeAttendanceListItem = (EmployeeAttendanceListItem) o;
        return Objects.equals(this.id, employeeAttendanceListItem.id)
                && Objects.equals(this.employee, employeeAttendanceListItem.employee)
                && Objects.equals(this.attendanceDate, employeeAttendanceListItem.attendanceDate)
                && Objects.equals(this.status, employeeAttendanceListItem.status)
                && Objects.equals(this.checkInTime, employeeAttendanceListItem.checkInTime)
                && Objects.equals(this.checkOutTime, employeeAttendanceListItem.checkOutTime)
                && Objects.equals(this.lateTime, employeeAttendanceListItem.lateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, employee, attendanceDate, status, checkInTime, checkOutTime, lateTime);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeAttendanceListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    employee: ").append(toIndentedString(employee)).append("\n");
        sb.append("    attendanceDate: ").append(toIndentedString(attendanceDate)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
        sb.append("    checkInTime: ").append(toIndentedString(checkInTime)).append("\n");
        sb.append("    checkOutTime: ").append(toIndentedString(checkOutTime)).append("\n");
        sb.append("    lateTime: ").append(toIndentedString(lateTime)).append("\n");
        sb.append("}");
        return sb.toString();
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces (except the first line).
     */
    private String toIndentedString(Object o) {
        if (o == null) {
            return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }
}
