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
 * TraineeContactDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeContactDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String contactType;

    private String contactValue;

    public TraineeContactDTO contactType(String contactType) {
        this.contactType = contactType;
        return this;
    }

    /**
     * Get contactType
     *
     * @return contactType
     */

    @Schema(name = "contactType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("contactType")
    public String getContactType() {
        return contactType;
    }

    public void setContactType(String contactType) {
        this.contactType = contactType;
    }

    public TraineeContactDTO contactValue(String contactValue) {
        this.contactValue = contactValue;
        return this;
    }

    /**
     * Get contactValue
     *
     * @return contactValue
     */

    @Schema(name = "contactValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("contactValue")
    public String getContactValue() {
        return contactValue;
    }

    public void setContactValue(String contactValue) {
        this.contactValue = contactValue;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeContactDTO traineeContactDTO = (TraineeContactDTO) o;
        return Objects.equals(this.contactType, traineeContactDTO.contactType)
                && Objects.equals(this.contactValue, traineeContactDTO.contactValue);
    }

    @Override
    public int hashCode() {
        return Objects.hash(contactType, contactValue);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeContactDTO {\n");
        sb.append("    contactType: ").append(toIndentedString(contactType)).append("\n");
        sb.append("    contactValue: ").append(toIndentedString(contactValue)).append("\n");
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
