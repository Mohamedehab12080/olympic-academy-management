package bs.service.employee.model.generated;

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
 * AssignCourseDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class AssignCourseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Valid
    private List<Integer> courseIdToBeAdded = new ArrayList<>();

    @Valid
    private List<Integer> courseIdToBeDeleted = new ArrayList<>();

    public AssignCourseDTO courseIdToBeAdded(List<Integer> courseIdToBeAdded) {
        this.courseIdToBeAdded = courseIdToBeAdded;
        return this;
    }

    public AssignCourseDTO addCourseIdToBeAddedItem(Integer courseIdToBeAddedItem) {
        if (this.courseIdToBeAdded == null) {
            this.courseIdToBeAdded = new ArrayList<>();
        }
        this.courseIdToBeAdded.add(courseIdToBeAddedItem);
        return this;
    }

    /**
     * Get courseIdToBeAdded
     *
     * @return courseIdToBeAdded
     */
    @NotNull
    @Schema(name = "courseIdToBeAdded", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("courseIdToBeAdded")
    public List<Integer> getCourseIdToBeAdded() {
        return courseIdToBeAdded;
    }

    public void setCourseIdToBeAdded(List<Integer> courseIdToBeAdded) {
        this.courseIdToBeAdded = courseIdToBeAdded;
    }

    public AssignCourseDTO courseIdToBeDeleted(List<Integer> courseIdToBeDeleted) {
        this.courseIdToBeDeleted = courseIdToBeDeleted;
        return this;
    }

    public AssignCourseDTO addCourseIdToBeDeletedItem(Integer courseIdToBeDeletedItem) {
        if (this.courseIdToBeDeleted == null) {
            this.courseIdToBeDeleted = new ArrayList<>();
        }
        this.courseIdToBeDeleted.add(courseIdToBeDeletedItem);
        return this;
    }

    /**
     * Get courseIdToBeDeleted
     *
     * @return courseIdToBeDeleted
     */

    @Schema(name = "courseIdToBeDeleted", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("courseIdToBeDeleted")
    public List<Integer> getCourseIdToBeDeleted() {
        return courseIdToBeDeleted;
    }

    public void setCourseIdToBeDeleted(List<Integer> courseIdToBeDeleted) {
        this.courseIdToBeDeleted = courseIdToBeDeleted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AssignCourseDTO assignCourseDTO = (AssignCourseDTO) o;
        return Objects.equals(this.courseIdToBeAdded, assignCourseDTO.courseIdToBeAdded)
                && Objects.equals(this.courseIdToBeDeleted, assignCourseDTO.courseIdToBeDeleted);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseIdToBeAdded, courseIdToBeDeleted);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class AssignCourseDTO {\n");
        sb.append("    courseIdToBeAdded: ").append(toIndentedString(courseIdToBeAdded)).append("\n");
        sb.append("    courseIdToBeDeleted: ").append(toIndentedString(courseIdToBeDeleted)).append("\n");
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
