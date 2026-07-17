package bs.service.employee.model.generated;

import bs.service.employee.model.enums.SessionStatus;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * CourseSessionDayDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class CourseSessionDayDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private Integer courseId;

    @Valid
    private List<Integer> trainersId = new ArrayList<>();

    private Integer placeId;

    private String sessionDay;

    private String startTime;

    private String endTime;

    private SessionStatus status;

    private String note;

    public CourseSessionDayDTO title(String title) {
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

    public CourseSessionDayDTO courseId(Integer courseId) {
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

    public CourseSessionDayDTO trainersId(List<Integer> trainersId) {
        this.trainersId = trainersId;
        return this;
    }

    public CourseSessionDayDTO addTrainersIdItem(Integer trainersIdItem) {
        if (this.trainersId == null) {
            this.trainersId = new ArrayList<>();
        }
        this.trainersId.add(trainersIdItem);
        return this;
    }

    /**
     * Get trainersId
     *
     * @return trainersId
     */
    @NotNull
    @Schema(name = "trainersId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("trainersId")
    public List<Integer> getTrainersId() {
        return trainersId;
    }

    public void setTrainersId(List<Integer> trainersId) {
        this.trainersId = trainersId;
    }

    public CourseSessionDayDTO placeId(Integer placeId) {
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

    public CourseSessionDayDTO sessionDay(String sessionDay) {
        this.sessionDay = sessionDay;
        return this;
    }

    /**
     * Specific day to update (e.g., MONDAY, TUESDAY, etc.)
     *
     * @return sessionDay
     */
    @NotNull
    @Schema(name = "sessionDay", description = "Specific day to update (e.g., MONDAY, TUESDAY, etc.)", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("sessionDay")
    public String getSessionDay() {
        return sessionDay;
    }

    public void setSessionDay(String sessionDay) {
        this.sessionDay = sessionDay;
    }

    public CourseSessionDayDTO startTime(String startTime) {
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

    public CourseSessionDayDTO endTime(String endTime) {
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

    public CourseSessionDayDTO status(SessionStatus status) {
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

    public CourseSessionDayDTO note(String note) {
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
        CourseSessionDayDTO courseSessionDayDTO = (CourseSessionDayDTO) o;
        return Objects.equals(this.title, courseSessionDayDTO.title)
                && Objects.equals(this.courseId, courseSessionDayDTO.courseId)
                && Objects.equals(this.trainersId, courseSessionDayDTO.trainersId)
                && Objects.equals(this.placeId, courseSessionDayDTO.placeId)
                && Objects.equals(this.sessionDay, courseSessionDayDTO.sessionDay)
                && Objects.equals(this.startTime, courseSessionDayDTO.startTime)
                && Objects.equals(this.endTime, courseSessionDayDTO.endTime)
                && Objects.equals(this.status, courseSessionDayDTO.status)
                && Objects.equals(this.note, courseSessionDayDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, courseId, trainersId, placeId, sessionDay, startTime, endTime, status, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class CourseSessionDayDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    courseId: ").append(toIndentedString(courseId)).append("\n");
        sb.append("    trainersId: ").append(toIndentedString(trainersId)).append("\n");
        sb.append("    placeId: ").append(toIndentedString(placeId)).append("\n");
        sb.append("    sessionDay: ").append(toIndentedString(sessionDay)).append("\n");
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
