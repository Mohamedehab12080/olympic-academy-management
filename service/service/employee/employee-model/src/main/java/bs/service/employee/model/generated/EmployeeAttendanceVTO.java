package bs.service.employee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.employee.model.enums.EmployeeAttendanceStatus;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * EmployeeAttendanceVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeAttendanceVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LookupVTO employee;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate attendanceDate;

    private EmployeeAttendanceStatus status;

    private String checkInTime;

    private String checkOutTime;

    private Integer lateTime;

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public EmployeeAttendanceVTO id(Integer id) {
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

    public EmployeeAttendanceVTO employee(LookupVTO employee) {
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
    public LookupVTO getEmployee() {
        return employee;
    }

    public void setEmployee(LookupVTO employee) {
        this.employee = employee;
    }

    public EmployeeAttendanceVTO attendanceDate(LocalDate attendanceDate) {
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

    public EmployeeAttendanceVTO status(EmployeeAttendanceStatus status) {
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

    public EmployeeAttendanceVTO checkInTime(String checkInTime) {
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

    public EmployeeAttendanceVTO checkOutTime(String checkOutTime) {
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

    public EmployeeAttendanceVTO lateTime(Integer lateTime) {
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

    public EmployeeAttendanceVTO note(String note) {
        this.note = note;
        return this;
    }

    /**
     * Get note
     *
     * @return note
     */

    @Schema(name = "note", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("note")
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public EmployeeAttendanceVTO createdOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    /**
     * Get createdOn
     *
     * @return createdOn
     */
    @Valid
    @Schema(name = "createdOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdOn")
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public EmployeeAttendanceVTO createdBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    /**
     * Get createdBy
     *
     * @return createdBy
     */
    @Valid
    @Schema(name = "createdBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdBy")
    public LightUserVTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
    }

    public EmployeeAttendanceVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
        this.lastModifiedOn = lastModifiedOn;
        return this;
    }

    /**
     * Get lastModifiedOn
     *
     * @return lastModifiedOn
     */
    @Valid
    @Schema(name = "lastModifiedOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastModifiedOn")
    public LocalDateTime getLastModifiedOn() {
        return lastModifiedOn;
    }

    public void setLastModifiedOn(LocalDateTime lastModifiedOn) {
        this.lastModifiedOn = lastModifiedOn;
    }

    public EmployeeAttendanceVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    /**
     * Get lastModifiedBy
     *
     * @return lastModifiedBy
     */
    @Valid
    @Schema(name = "lastModifiedBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastModifiedBy")
    public LightUserVTO getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(LightUserVTO lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EmployeeAttendanceVTO employeeAttendanceVTO = (EmployeeAttendanceVTO) o;
        return Objects.equals(this.id, employeeAttendanceVTO.id)
                && Objects.equals(this.employee, employeeAttendanceVTO.employee)
                && Objects.equals(this.attendanceDate, employeeAttendanceVTO.attendanceDate)
                && Objects.equals(this.status, employeeAttendanceVTO.status)
                && Objects.equals(this.checkInTime, employeeAttendanceVTO.checkInTime)
                && Objects.equals(this.checkOutTime, employeeAttendanceVTO.checkOutTime)
                && Objects.equals(this.lateTime, employeeAttendanceVTO.lateTime)
                && Objects.equals(this.note, employeeAttendanceVTO.note)
                && Objects.equals(this.createdOn, employeeAttendanceVTO.createdOn)
                && Objects.equals(this.createdBy, employeeAttendanceVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, employeeAttendanceVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, employeeAttendanceVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, employee, attendanceDate, status, checkInTime, checkOutTime, lateTime, note, createdOn,
                createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeAttendanceVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    employee: ").append(toIndentedString(employee)).append("\n");
        sb.append("    attendanceDate: ").append(toIndentedString(attendanceDate)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
        sb.append("    checkInTime: ").append(toIndentedString(checkInTime)).append("\n");
        sb.append("    checkOutTime: ").append(toIndentedString(checkOutTime)).append("\n");
        sb.append("    lateTime: ").append(toIndentedString(lateTime)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
        sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
        sb.append("    lastModifiedOn: ").append(toIndentedString(lastModifiedOn)).append("\n");
        sb.append("    lastModifiedBy: ").append(toIndentedString(lastModifiedBy)).append("\n");
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
