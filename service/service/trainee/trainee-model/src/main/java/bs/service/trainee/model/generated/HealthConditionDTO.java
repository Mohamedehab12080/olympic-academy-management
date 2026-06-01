package bs.service.trainee.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * HealthConditionDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class HealthConditionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private String description;

    private String medication;

    private String note;

    public HealthConditionDTO title(String title) {
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

    public HealthConditionDTO description(String description) {
        this.description = description;
        return this;
    }

    /**
     * Get description
     *
     * @return description
     */

    @Schema(name = "description", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public HealthConditionDTO medication(String medication) {
        this.medication = medication;
        return this;
    }

    /**
     * Get medication
     *
     * @return medication
     */

    @Schema(name = "medication", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("medication")
    public String getMedication() {
        return medication;
    }

    public void setMedication(String medication) {
        this.medication = medication;
    }

    public HealthConditionDTO note(String note) {
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
        HealthConditionDTO healthConditionDTO = (HealthConditionDTO) o;
        return Objects.equals(this.title, healthConditionDTO.title)
                && Objects.equals(this.description, healthConditionDTO.description)
                && Objects.equals(this.medication, healthConditionDTO.medication)
                && Objects.equals(this.note, healthConditionDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, description, medication, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class HealthConditionDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    description: ").append(toIndentedString(description)).append("\n");
        sb.append("    medication: ").append(toIndentedString(medication)).append("\n");
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
