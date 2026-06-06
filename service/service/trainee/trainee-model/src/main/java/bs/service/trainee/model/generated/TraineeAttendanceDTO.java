package bs.service.trainee.model.generated;

import bs.service.trainee.model.enums.TraineeAttendanceStatus;
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
 * TraineeAttendanceDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeAttendanceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer courseSessionId;

    private Integer traineeId;

    private TraineeAttendanceStatus status;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate attendanceDate;

    private String checkInTime;

    private String checkOutTime;

    private Integer lateTime;

    private String note;

    public TraineeAttendanceDTO courseSessionId(Integer courseSessionId) {
        this.courseSessionId = courseSessionId;
        return this;
    }

    /**
     * ID of the course session
     *
     * @return courseSessionId
     */
    @NotNull
    @Schema(name = "courseSessionId", description = "ID of the course session", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("courseSessionId")
    public Integer getCourseSessionId() {
        return courseSessionId;
    }

    public void setCourseSessionId(Integer courseSessionId) {
        this.courseSessionId = courseSessionId;
    }

    public TraineeAttendanceDTO traineeId(Integer traineeId) {
        this.traineeId = traineeId;
        return this;
    }

    /**
     * ID of the trainee
     *
     * @return traineeId
     */
    @NotNull
    @Schema(name = "traineeId", description = "ID of the trainee", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("traineeId")
    public Integer getTraineeId() {
        return traineeId;
    }

    public void setTraineeId(Integer traineeId) {
        this.traineeId = traineeId;
    }

    public TraineeAttendanceDTO status(TraineeAttendanceStatus status) {
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
    public TraineeAttendanceStatus getStatus() {
        return status;
    }

    public void setStatus(TraineeAttendanceStatus status) {
        this.status = status;
    }

    public TraineeAttendanceDTO attendanceDate(LocalDate attendanceDate) {
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

    public TraineeAttendanceDTO checkInTime(String checkInTime) {
        this.checkInTime = checkInTime;
        return this;
    }

    /**
     * Check in time (HH:MM:SS)
     *
     * @return checkInTime
     */

    @Schema(name = "checkInTime", description = "Check in time (HH:MM:SS)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("checkInTime")
    public String getCheckInTime() {
        return checkInTime;
    }

    public void setCheckInTime(String checkInTime) {
        this.checkInTime = checkInTime;
    }

    public TraineeAttendanceDTO checkOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
        return this;
    }

    /**
     * Check out time (HH:MM:SS)
     *
     * @return checkOutTime
     */

    @Schema(name = "checkOutTime", description = "Check out time (HH:MM:SS)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("checkOutTime")
    public String getCheckOutTime() {
        return checkOutTime;
    }

    public void setCheckOutTime(String checkOutTime) {
        this.checkOutTime = checkOutTime;
    }

    public TraineeAttendanceDTO lateTime(Integer lateTime) {
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

    public TraineeAttendanceDTO note(String note) {
        this.note = note;
        return this;
    }

    /**
     * Additional notes
     *
     * @return note
     */

    @Schema(name = "note", description = "Additional notes", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
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
        TraineeAttendanceDTO traineeAttendanceDTO = (TraineeAttendanceDTO) o;
        return Objects.equals(this.courseSessionId, traineeAttendanceDTO.courseSessionId)
                && Objects.equals(this.traineeId, traineeAttendanceDTO.traineeId)
                && Objects.equals(this.status, traineeAttendanceDTO.status)
                && Objects.equals(this.attendanceDate, traineeAttendanceDTO.attendanceDate)
                && Objects.equals(this.checkInTime, traineeAttendanceDTO.checkInTime)
                && Objects.equals(this.checkOutTime, traineeAttendanceDTO.checkOutTime)
                && Objects.equals(this.lateTime, traineeAttendanceDTO.lateTime)
                && Objects.equals(this.note, traineeAttendanceDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseSessionId, traineeId, status, attendanceDate, checkInTime, checkOutTime, lateTime,
                note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeAttendanceDTO {\n");
        sb.append("    courseSessionId: ").append(toIndentedString(courseSessionId)).append("\n");
        sb.append("    traineeId: ").append(toIndentedString(traineeId)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
        sb.append("    attendanceDate: ").append(toIndentedString(attendanceDate)).append("\n");
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
