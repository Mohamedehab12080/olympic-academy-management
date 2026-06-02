package bs.service.employee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * TrainerCourseAssignmentVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TrainerCourseAssignmentVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LookupVTO trainer;

    private LookupVTO course;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    public TrainerCourseAssignmentVTO id(Integer id) {
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

    public TrainerCourseAssignmentVTO trainer(LookupVTO trainer) {
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
    public LookupVTO getTrainer() {
        return trainer;
    }

    public void setTrainer(LookupVTO trainer) {
        this.trainer = trainer;
    }

    public TrainerCourseAssignmentVTO course(LookupVTO course) {
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

    public TrainerCourseAssignmentVTO createdOn(LocalDateTime createdOn) {
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

    public TrainerCourseAssignmentVTO createdBy(LightUserVTO createdBy) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TrainerCourseAssignmentVTO trainerCourseAssignmentVTO = (TrainerCourseAssignmentVTO) o;
        return Objects.equals(this.id, trainerCourseAssignmentVTO.id)
                && Objects.equals(this.trainer, trainerCourseAssignmentVTO.trainer)
                && Objects.equals(this.course, trainerCourseAssignmentVTO.course)
                && Objects.equals(this.createdOn, trainerCourseAssignmentVTO.createdOn)
                && Objects.equals(this.createdBy, trainerCourseAssignmentVTO.createdBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainer, course, createdOn, createdBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TrainerCourseAssignmentVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    trainer: ").append(toIndentedString(trainer)).append("\n");
        sb.append("    course: ").append(toIndentedString(course)).append("\n");
        sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
        sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
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
