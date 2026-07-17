package bs.service.trainee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.employee.model.generated.CourseSessionLookupVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

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

    private CourseSessionLookupVTO session;

    private String attendanceDate;

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

    public TraineeAttendanceListItem session(CourseSessionLookupVTO session) {
        this.session = session;
        return this;
    }

    /**
     * Get session
     *
     * @return session
     */
    @Valid
    @Schema(name = "session", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("session")
    public CourseSessionLookupVTO getSession() {
        return session;
    }

    public void setSession(CourseSessionLookupVTO session) {
        this.session = session;
    }

    public TraineeAttendanceListItem attendanceDate(String attendanceDate) {
        this.attendanceDate = attendanceDate;
        return this;
    }

    /**
     * Get attendanceDate
     *
     * @return attendanceDate
     */

    @Schema(name = "attendanceDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("attendanceDate")
    public String getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(String attendanceDate) {
        this.attendanceDate = attendanceDate;
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
                && Objects.equals(this.session, traineeAttendanceListItem.session)
                && Objects.equals(this.attendanceDate, traineeAttendanceListItem.attendanceDate)
                && Objects.equals(this.status, traineeAttendanceListItem.status)
                && Objects.equals(this.checkInTime, traineeAttendanceListItem.checkInTime)
                && Objects.equals(this.checkOutTime, traineeAttendanceListItem.checkOutTime)
                && Objects.equals(this.lateTime, traineeAttendanceListItem.lateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainee, session, attendanceDate, status, checkInTime, checkOutTime, lateTime);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeAttendanceListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    trainee: ").append(toIndentedString(trainee)).append("\n");
        sb.append("    session: ").append(toIndentedString(session)).append("\n");
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
