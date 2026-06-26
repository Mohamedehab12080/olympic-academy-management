package bs.service.trainee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
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
 * TraineeAttendanceListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeAttendanceListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LightUserVTO trainee;

    private String sessionTitle;

    private String courseTitle;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sessionDate;

    private String sessionDay;

    private LookupVTO status;

    private String checkInTime;

    private String checkOutTime;

    private Integer lateTime;

    public TraineeAttendanceListItem id(Integer id) {
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

    public TraineeAttendanceListItem trainee(LightUserVTO trainee) {
        this.trainee = trainee;
        return this;
    }

    /**
     * Get trainee
     *
     * @return trainee
     */
    @Valid
    @Schema(name = "trainee", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("trainee")
    public LightUserVTO getTrainee() {
        return trainee;
    }

    public void setTrainee(LightUserVTO trainee) {
        this.trainee = trainee;
    }

    public TraineeAttendanceListItem sessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
        return this;
    }

    /**
     * Get sessionTitle
     *
     * @return sessionTitle
     */

    @Schema(name = "sessionTitle", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("sessionTitle")
    public String getSessionTitle() {
        return sessionTitle;
    }

    public void setSessionTitle(String sessionTitle) {
        this.sessionTitle = sessionTitle;
    }

    public TraineeAttendanceListItem courseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
        return this;
    }

    /**
     * Get courseTitle
     *
     * @return courseTitle
     */

    @Schema(name = "courseTitle", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("courseTitle")
    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public TraineeAttendanceListItem sessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
        return this;
    }

    /**
     * Get sessionDate
     *
     * @return sessionDate
     */
    @Valid
    @Schema(name = "sessionDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("sessionDate")
    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public TraineeAttendanceListItem sessionDay(String sessionDay) {
        this.sessionDay = sessionDay;
        return this;
    }

    /**
     * Get sessionDay
     *
     * @return sessionDay
     */

    @Schema(name = "sessionDay", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("sessionDay")
    public String getSessionDay() {
        return sessionDay;
    }

    public void setSessionDay(String sessionDay) {
        this.sessionDay = sessionDay;
    }

    public TraineeAttendanceListItem status(LookupVTO status) {
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
    public LookupVTO getStatus() {
        return status;
    }

    public void setStatus(LookupVTO status) {
        this.status = status;
    }

    public TraineeAttendanceListItem checkInTime(String checkInTime) {
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

    public TraineeAttendanceListItem checkOutTime(String checkOutTime) {
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

    public TraineeAttendanceListItem lateTime(Integer lateTime) {
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
        TraineeAttendanceListItem traineeAttendanceListItem = (TraineeAttendanceListItem) o;
        return Objects.equals(this.id, traineeAttendanceListItem.id)
                && Objects.equals(this.trainee, traineeAttendanceListItem.trainee)
                && Objects.equals(this.sessionTitle, traineeAttendanceListItem.sessionTitle)
                && Objects.equals(this.courseTitle, traineeAttendanceListItem.courseTitle)
                && Objects.equals(this.sessionDate, traineeAttendanceListItem.sessionDate)
                && Objects.equals(this.sessionDay, traineeAttendanceListItem.sessionDay)
                && Objects.equals(this.status, traineeAttendanceListItem.status)
                && Objects.equals(this.checkInTime, traineeAttendanceListItem.checkInTime)
                && Objects.equals(this.checkOutTime, traineeAttendanceListItem.checkOutTime)
                && Objects.equals(this.lateTime, traineeAttendanceListItem.lateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainee, sessionTitle, courseTitle, sessionDate, sessionDay, status, checkInTime,
                checkOutTime, lateTime);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeAttendanceListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    trainee: ").append(toIndentedString(trainee)).append("\n");
        sb.append("    sessionTitle: ").append(toIndentedString(sessionTitle)).append("\n");
        sb.append("    courseTitle: ").append(toIndentedString(courseTitle)).append("\n");
        sb.append("    sessionDate: ").append(toIndentedString(sessionDate)).append("\n");
        sb.append("    sessionDay: ").append(toIndentedString(sessionDay)).append("\n");
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
