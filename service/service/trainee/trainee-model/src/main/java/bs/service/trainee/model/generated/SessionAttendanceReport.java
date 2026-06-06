package bs.service.trainee.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * SessionAttendanceReport
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class SessionAttendanceReport implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer sessionId;

    private String sessionTitle;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sessionDate;

    private Integer totalTrainees;

    private Integer present;

    private Integer absent;

    private Integer late;

    private Integer excused;

    private Double attendanceRate;

    @Valid
    private List<@Valid TraineeAttendanceListItem> details = new ArrayList<>();

    public SessionAttendanceReport sessionId(Integer sessionId) {
        this.sessionId = sessionId;
        return this;
    }

    /**
     * Get sessionId
     *
     * @return sessionId
     */

    @Schema(name = "sessionId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("sessionId")
    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public SessionAttendanceReport sessionTitle(String sessionTitle) {
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

    public SessionAttendanceReport sessionDate(LocalDate sessionDate) {
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

    public SessionAttendanceReport totalTrainees(Integer totalTrainees) {
        this.totalTrainees = totalTrainees;
        return this;
    }

    /**
     * Get totalTrainees
     *
     * @return totalTrainees
     */

    @Schema(name = "totalTrainees", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalTrainees")
    public Integer getTotalTrainees() {
        return totalTrainees;
    }

    public void setTotalTrainees(Integer totalTrainees) {
        this.totalTrainees = totalTrainees;
    }

    public SessionAttendanceReport present(Integer present) {
        this.present = present;
        return this;
    }

    /**
     * Get present
     *
     * @return present
     */

    @Schema(name = "present", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("present")
    public Integer getPresent() {
        return present;
    }

    public void setPresent(Integer present) {
        this.present = present;
    }

    public SessionAttendanceReport absent(Integer absent) {
        this.absent = absent;
        return this;
    }

    /**
     * Get absent
     *
     * @return absent
     */

    @Schema(name = "absent", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("absent")
    public Integer getAbsent() {
        return absent;
    }

    public void setAbsent(Integer absent) {
        this.absent = absent;
    }

    public SessionAttendanceReport late(Integer late) {
        this.late = late;
        return this;
    }

    /**
     * Get late
     *
     * @return late
     */

    @Schema(name = "late", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("late")
    public Integer getLate() {
        return late;
    }

    public void setLate(Integer late) {
        this.late = late;
    }

    public SessionAttendanceReport excused(Integer excused) {
        this.excused = excused;
        return this;
    }

    /**
     * Get excused
     *
     * @return excused
     */

    @Schema(name = "excused", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("excused")
    public Integer getExcused() {
        return excused;
    }

    public void setExcused(Integer excused) {
        this.excused = excused;
    }

    public SessionAttendanceReport attendanceRate(Double attendanceRate) {
        this.attendanceRate = attendanceRate;
        return this;
    }

    /**
     * Get attendanceRate
     *
     * @return attendanceRate
     */

    @Schema(name = "attendanceRate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("attendanceRate")
    public Double getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(Double attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public SessionAttendanceReport details(List<@Valid TraineeAttendanceListItem> details) {
        this.details = details;
        return this;
    }

    public SessionAttendanceReport addDetailsItem(TraineeAttendanceListItem detailsItem) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detailsItem);
        return this;
    }

    /**
     * Get details
     *
     * @return details
     */
    @Valid
    @Schema(name = "details", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("details")
    public List<@Valid TraineeAttendanceListItem> getDetails() {
        return details;
    }

    public void setDetails(List<@Valid TraineeAttendanceListItem> details) {
        this.details = details;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SessionAttendanceReport sessionAttendanceReport = (SessionAttendanceReport) o;
        return Objects.equals(this.sessionId, sessionAttendanceReport.sessionId)
                && Objects.equals(this.sessionTitle, sessionAttendanceReport.sessionTitle)
                && Objects.equals(this.sessionDate, sessionAttendanceReport.sessionDate)
                && Objects.equals(this.totalTrainees, sessionAttendanceReport.totalTrainees)
                && Objects.equals(this.present, sessionAttendanceReport.present)
                && Objects.equals(this.absent, sessionAttendanceReport.absent)
                && Objects.equals(this.late, sessionAttendanceReport.late)
                && Objects.equals(this.excused, sessionAttendanceReport.excused)
                && Objects.equals(this.attendanceRate, sessionAttendanceReport.attendanceRate)
                && Objects.equals(this.details, sessionAttendanceReport.details);
    }

    @Override
    public int hashCode() {
        return Objects.hash(sessionId, sessionTitle, sessionDate, totalTrainees, present, absent, late, excused,
                attendanceRate, details);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SessionAttendanceReport {\n");
        sb.append("    sessionId: ").append(toIndentedString(sessionId)).append("\n");
        sb.append("    sessionTitle: ").append(toIndentedString(sessionTitle)).append("\n");
        sb.append("    sessionDate: ").append(toIndentedString(sessionDate)).append("\n");
        sb.append("    totalTrainees: ").append(toIndentedString(totalTrainees)).append("\n");
        sb.append("    present: ").append(toIndentedString(present)).append("\n");
        sb.append("    absent: ").append(toIndentedString(absent)).append("\n");
        sb.append("    late: ").append(toIndentedString(late)).append("\n");
        sb.append("    excused: ").append(toIndentedString(excused)).append("\n");
        sb.append("    attendanceRate: ").append(toIndentedString(attendanceRate)).append("\n");
        sb.append("    details: ").append(toIndentedString(details)).append("\n");
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
