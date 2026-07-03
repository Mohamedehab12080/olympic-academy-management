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
import java.util.ArrayList;
import java.util.List;
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

    @Valid
    private List<Integer> trainersId = new ArrayList<>();

    private Integer placeId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sessionDate;

    @Valid
    private List<String> sessionDays = new ArrayList<>();

    private String sessionDay;

    private Boolean updateSingleSession;

    @Valid
    private List<Integer> sessionIdsToDelete = new ArrayList<>();

    @Valid
    private List<String> daysToRemove = new ArrayList<>();

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

    public CourseSessionDTO trainersId(List<Integer> trainersId) {
        this.trainersId = trainersId;
        return this;
    }

    public CourseSessionDTO addTrainersIdItem(Integer trainersIdItem) {
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
    @Valid
    @Schema(name = "sessionDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("sessionDate")
    public LocalDate getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDate sessionDate) {
        this.sessionDate = sessionDate;
    }

    public CourseSessionDTO sessionDays(List<String> sessionDays) {
        this.sessionDays = sessionDays;
        return this;
    }

    public CourseSessionDTO addSessionDaysItem(String sessionDaysItem) {
        if (this.sessionDays == null) {
            this.sessionDays = new ArrayList<>();
        }
        this.sessionDays.add(sessionDaysItem);
        return this;
    }

    /**
     * Get sessionDays
     *
     * @return sessionDays
     */
    @NotNull
    @Schema(name = "sessionDays", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("sessionDays")
    public List<String> getSessionDays() {
        return sessionDays;
    }

    public void setSessionDays(List<String> sessionDays) {
        this.sessionDays = sessionDays;
    }

    public CourseSessionDTO sessionDay(String sessionDay) {
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

    public CourseSessionDTO updateSingleSession(Boolean updateSingleSession) {
        this.updateSingleSession = updateSingleSession;
        return this;
    }

    /**
     * Get updateSingleSession
     *
     * @return updateSingleSession
     */

    @Schema(name = "updateSingleSession", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("updateSingleSession")
    public Boolean getUpdateSingleSession() {
        return updateSingleSession;
    }

    public void setUpdateSingleSession(Boolean updateSingleSession) {
        this.updateSingleSession = updateSingleSession;
    }

    public CourseSessionDTO sessionIdsToDelete(List<Integer> sessionIdsToDelete) {
        this.sessionIdsToDelete = sessionIdsToDelete;
        return this;
    }

    public CourseSessionDTO addSessionIdsToDeleteItem(Integer sessionIdsToDeleteItem) {
        if (this.sessionIdsToDelete == null) {
            this.sessionIdsToDelete = new ArrayList<>();
        }
        this.sessionIdsToDelete.add(sessionIdsToDeleteItem);
        return this;
    }

    /**
     * Get sessionIdsToDelete
     *
     * @return sessionIdsToDelete
     */

    @Schema(name = "sessionIdsToDelete", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("sessionIdsToDelete")
    public List<Integer> getSessionIdsToDelete() {
        return sessionIdsToDelete;
    }

    public void setSessionIdsToDelete(List<Integer> sessionIdsToDelete) {
        this.sessionIdsToDelete = sessionIdsToDelete;
    }

    public CourseSessionDTO daysToRemove(List<String> daysToRemove) {
        this.daysToRemove = daysToRemove;
        return this;
    }

    public CourseSessionDTO addDaysToRemoveItem(String daysToRemoveItem) {
        if (this.daysToRemove == null) {
            this.daysToRemove = new ArrayList<>();
        }
        this.daysToRemove.add(daysToRemoveItem);
        return this;
    }

    /**
     * Get daysToRemove
     *
     * @return daysToRemove
     */

    @Schema(name = "daysToRemove", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("daysToRemove")
    public List<String> getDaysToRemove() {
        return daysToRemove;
    }

    public void setDaysToRemove(List<String> daysToRemove) {
        this.daysToRemove = daysToRemove;
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
                && Objects.equals(this.trainersId, courseSessionDTO.trainersId)
                && Objects.equals(this.placeId, courseSessionDTO.placeId)
                && Objects.equals(this.sessionDate, courseSessionDTO.sessionDate)
                && Objects.equals(this.sessionDays, courseSessionDTO.sessionDays)
                && Objects.equals(this.sessionDay, courseSessionDTO.sessionDay)
                && Objects.equals(this.updateSingleSession, courseSessionDTO.updateSingleSession)
                && Objects.equals(this.sessionIdsToDelete, courseSessionDTO.sessionIdsToDelete)
                && Objects.equals(this.daysToRemove, courseSessionDTO.daysToRemove)
                && Objects.equals(this.startTime, courseSessionDTO.startTime)
                && Objects.equals(this.endTime, courseSessionDTO.endTime)
                && Objects.equals(this.status, courseSessionDTO.status)
                && Objects.equals(this.note, courseSessionDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, courseId, trainersId, placeId, sessionDate, sessionDays, sessionDay,
                updateSingleSession, sessionIdsToDelete, daysToRemove, startTime, endTime, status, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class CourseSessionDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    courseId: ").append(toIndentedString(courseId)).append("\n");
        sb.append("    trainersId: ").append(toIndentedString(trainersId)).append("\n");
        sb.append("    placeId: ").append(toIndentedString(placeId)).append("\n");
        sb.append("    sessionDate: ").append(toIndentedString(sessionDate)).append("\n");
        sb.append("    sessionDays: ").append(toIndentedString(sessionDays)).append("\n");
        sb.append("    sessionDay: ").append(toIndentedString(sessionDay)).append("\n");
        sb.append("    updateSingleSession: ").append(toIndentedString(updateSingleSession)).append("\n");
        sb.append("    sessionIdsToDelete: ").append(toIndentedString(sessionIdsToDelete)).append("\n");
        sb.append("    daysToRemove: ").append(toIndentedString(daysToRemove)).append("\n");
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
