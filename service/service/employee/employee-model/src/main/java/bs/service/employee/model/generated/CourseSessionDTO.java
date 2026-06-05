package bs.service.employee.model.generated;

import bs.service.employee.model.enums.SessionStatus;
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
 * CourseSessionDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class CourseSessionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private Integer courseId;

    private Integer trainerId;

    private Integer placeId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sessionDate;

    private String startTime;

    private String endTime;

    private SessionStatus status;

    private String note;

    public CourseSessionDTO title(String title) {
        this.title = title;
        return this;
    }

    /**
     * Get title
     *
     * @return title
     */
    @NotNull
    @Schema(name = "title", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CourseSessionDTO courseId(Integer courseId) {
        this.courseId = courseId;
        return this;
    }

    /**
     * Get courseId
     *
     * @return courseId
     */
    @NotNull
    @Schema(name = "courseId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("courseId")
    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public CourseSessionDTO trainerId(Integer trainerId) {
        this.trainerId = trainerId;
        return this;
    }

    /**
     * Get trainerId
     *
     * @return trainerId
     */
    @NotNull
    @Schema(name = "trainerId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("trainerId")
    public Integer getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Integer trainerId) {
        this.trainerId = trainerId;
    }

    public CourseSessionDTO placeId(Integer placeId) {
        this.placeId = placeId;
        return this;
    }

    /**
     * Get placeId
     *
     * @return placeId
     */
    @NotNull
    @Schema(name = "placeId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("placeId")
    public Integer getPlaceId() {
        return placeId;
    }

    public void setPlaceId(Integer placeId) {
        this.placeId = placeId;
    }

    public CourseSessionDTO sessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
        return this;
    }

    /**
     * Get sessionDate
     *
     * @return sessionDate
     */
    @NotNull
    @Valid
    @Schema(name = "sessionDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("sessionDate")
    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public CourseSessionDTO startTime(String startTime) {
        this.startTime = startTime;
        return this;
    }

    /**
     * Get startTime
     *
     * @return startTime
     */
    @NotNull
    @Schema(name = "startTime", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("startTime")
    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public CourseSessionDTO endTime(String endTime) {
        this.endTime = endTime;
        return this;
    }

    /**
     * Get endTime
     *
     * @return endTime
     */
    @NotNull
    @Schema(name = "endTime", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("endTime")
    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public CourseSessionDTO status(SessionStatus status) {
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
    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public CourseSessionDTO note(String note) {
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
        CourseSessionDTO courseSessionDTO = (CourseSessionDTO) o;
        return Objects.equals(this.title, courseSessionDTO.title)
                && Objects.equals(this.courseId, courseSessionDTO.courseId)
                && Objects.equals(this.trainerId, courseSessionDTO.trainerId)
                && Objects.equals(this.placeId, courseSessionDTO.placeId)
                && Objects.equals(this.sessionDate, courseSessionDTO.sessionDate)
                && Objects.equals(this.startTime, courseSessionDTO.startTime)
                && Objects.equals(this.endTime, courseSessionDTO.endTime)
                && Objects.equals(this.status, courseSessionDTO.status)
                && Objects.equals(this.note, courseSessionDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, courseId, trainerId, placeId, sessionDate, startTime, endTime, status, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class CourseSessionDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    courseId: ").append(toIndentedString(courseId)).append("\n");
        sb.append("    trainerId: ").append(toIndentedString(trainerId)).append("\n");
        sb.append("    placeId: ").append(toIndentedString(placeId)).append("\n");
        sb.append("    sessionDate: ").append(toIndentedString(sessionDate)).append("\n");
        sb.append("    startTime: ").append(toIndentedString(startTime)).append("\n");
        sb.append("    endTime: ").append(toIndentedString(endTime)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
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
