package bs.service.employee.model.generated;

import bs.service.employee.model.enums.EmployeeAttendanceStatus;
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
 * EmployeeAttendanceDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeAttendanceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate attendanceDate;

    private EmployeeAttendanceStatus status;

    private String checkInTime;

    private String checkOutTime;

    private Integer lateTime;

    private String note;

    public EmployeeAttendanceDTO attendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
        return this;
    }

    /**
     * Get attendanceDate
     *
     * @return attendanceDate
     */
    @NotNull
    @Valid
    @Schema(name = "attendanceDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("attendanceDate")
    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public EmployeeAttendanceDTO status(EmployeeAttendanceStatus status) {
        this.status = status;
        return this;
    }

    /**
     * Get status
     *
     * @return status
     */
    @NotNull
    @Valid
    @Schema(name = "status", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("status")
    public EmployeeAttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(EmployeeAttendanceStatus status) {
        this.status = status;
    }

    public EmployeeAttendanceDTO checkInTime(String checkInTime) {
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

    public EmployeeAttendanceDTO checkOutTime(String checkOutTime) {
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

    public EmployeeAttendanceDTO lateTime(Integer lateTime) {
        this.lateTime = lateTime;
        return this;
    }

    /**
     * Late time in minutes
     *
     * @return lateTime
     */

    @Schema(name = "lateTime", description = "Late time in minutes", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lateTime")
    public Integer getLateTime() {
        return lateTime;
    }

    public void setLateTime(Integer lateTime) {
        this.lateTime = lateTime;
    }

    public EmployeeAttendanceDTO note(String note) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EmployeeAttendanceDTO employeeAttendanceDTO = (EmployeeAttendanceDTO) o;
        return Objects.equals(this.attendanceDate, employeeAttendanceDTO.attendanceDate)
                && Objects.equals(this.status, employeeAttendanceDTO.status)
                && Objects.equals(this.checkInTime, employeeAttendanceDTO.checkInTime)
                && Objects.equals(this.checkOutTime, employeeAttendanceDTO.checkOutTime)
                && Objects.equals(this.lateTime, employeeAttendanceDTO.lateTime)
                && Objects.equals(this.note, employeeAttendanceDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(attendanceDate, status, checkInTime, checkOutTime, lateTime, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeAttendanceDTO {\n");
        sb.append("    attendanceDate: ").append(toIndentedString(attendanceDate)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
        sb.append("    checkInTime: ").append(toIndentedString(checkInTime)).append("\n");
        sb.append("    checkOutTime: ").append(toIndentedString(checkOutTime)).append("\n");
        sb.append("    lateTime: ").append(toIndentedString(lateTime)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
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
