package bs.service.employee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
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
 * CourseSessionLookupVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class CourseSessionLookupVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String title;

    private LookupVTO course;

    private EmployeeLookupVTO trainer;

    private LookupVTO place;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate sessionDate;

    private String sessionDay;

    private String startTime;

    private String endTime;

    private LookupVTO status;

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public CourseSessionLookupVTO id(Integer id) {
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

    public CourseSessionLookupVTO title(String title) {
        this.title = title;
        return this;
    }

    /**
     * Get title
     *
     * @return title
     */

    @Schema(name = "title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CourseSessionLookupVTO course(LookupVTO course) {
        this.course = course;
        return this;
    }

    /**
     * Get course
     *
     * @return course
     */
    @Valid
    @Schema(name = "course", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("course")
    public LookupVTO getCourse() {
        return course;
    }

    public void setCourse(LookupVTO course) {
        this.course = course;
    }

    public CourseSessionLookupVTO trainer(EmployeeLookupVTO trainer) {
        this.trainer = trainer;
        return this;
    }

    /**
     * Get trainer
     *
     * @return trainer
     */
    @Valid
    @Schema(name = "trainer", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("trainer")
    public EmployeeLookupVTO getTrainer() {
        return trainer;
    }

    public void setTrainer(EmployeeLookupVTO trainer) {
        this.trainer = trainer;
    }

    public CourseSessionLookupVTO place(LookupVTO place) {
        this.place = place;
        return this;
    }

    /**
     * Get place
     *
     * @return place
     */
    @Valid
    @Schema(name = "place", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("place")
    public LookupVTO getPlace() {
        return place;
    }

    public void setPlace(LookupVTO place) {
        this.place = place;
    }

    public CourseSessionLookupVTO sessionDate(LocalDate sessionDate) {
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

    public CourseSessionLookupVTO sessionDay(String sessionDay) {
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

    public CourseSessionLookupVTO startTime(String startTime) {
        this.startTime = startTime;
        return this;
    }

    /**
     * Get startTime
     *
     * @return startTime
     */

    @Schema(name = "startTime", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("startTime")
    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public CourseSessionLookupVTO endTime(String endTime) {
        this.endTime = endTime;
        return this;
    }

    /**
     * Get endTime
     *
     * @return endTime
     */

    @Schema(name = "endTime", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("endTime")
    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public CourseSessionLookupVTO status(LookupVTO status) {
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

    public CourseSessionLookupVTO note(String note) {
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

    public CourseSessionLookupVTO createdOn(LocalDateTime createdOn) {
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

    public CourseSessionLookupVTO createdBy(LightUserVTO createdBy) {
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

    public CourseSessionLookupVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public CourseSessionLookupVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        CourseSessionLookupVTO courseSessionLookupVTO = (CourseSessionLookupVTO) o;
        return Objects.equals(this.id, courseSessionLookupVTO.id)
                && Objects.equals(this.title, courseSessionLookupVTO.title)
                && Objects.equals(this.course, courseSessionLookupVTO.course)
                && Objects.equals(this.trainer, courseSessionLookupVTO.trainer)
                && Objects.equals(this.place, courseSessionLookupVTO.place)
                && Objects.equals(this.sessionDate, courseSessionLookupVTO.sessionDate)
                && Objects.equals(this.sessionDay, courseSessionLookupVTO.sessionDay)
                && Objects.equals(this.startTime, courseSessionLookupVTO.startTime)
                && Objects.equals(this.endTime, courseSessionLookupVTO.endTime)
                && Objects.equals(this.status, courseSessionLookupVTO.status)
                && Objects.equals(this.note, courseSessionLookupVTO.note)
                && Objects.equals(this.createdOn, courseSessionLookupVTO.createdOn)
                && Objects.equals(this.createdBy, courseSessionLookupVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, courseSessionLookupVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, courseSessionLookupVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, course, trainer, place, sessionDate, sessionDay, startTime, endTime, status,
                note, createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class CourseSessionLookupVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    course: ").append(toIndentedString(course)).append("\n");
        sb.append("    trainer: ").append(toIndentedString(trainer)).append("\n");
        sb.append("    place: ").append(toIndentedString(place)).append("\n");
        sb.append("    sessionDate: ").append(toIndentedString(sessionDate)).append("\n");
        sb.append("    sessionDay: ").append(toIndentedString(sessionDay)).append("\n");
        sb.append("    startTime: ").append(toIndentedString(startTime)).append("\n");
        sb.append("    endTime: ").append(toIndentedString(endTime)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
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
