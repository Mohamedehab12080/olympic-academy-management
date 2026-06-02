package bs.service.trainee.model.generated;

import bs.lib.common.model.enums.ContactTypes;
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
 * TraineeContactListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeContactListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private ContactTypes contactType;

    private String contactValue;

    public TraineeContactListItem id(Integer id) {
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

    public TraineeContactListItem contactType(ContactTypes contactType) {
        this.contactType = contactType;
        return this;
    }

    /**
     * Get contactType
     *
     * @return contactType
     */
    @Valid
    @Schema(name = "contactType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("contactType")
    public ContactTypes getContactType() {
        return contactType;
    }

    public void setContactType(ContactTypes contactType) {
        this.contactType = contactType;
    }

    public TraineeContactListItem contactValue(String contactValue) {
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
        TraineeContactListItem traineeContactListItem = (TraineeContactListItem) o;
        return Objects.equals(this.id, traineeContactListItem.id)
                && Objects.equals(this.contactType, traineeContactListItem.contactType)
                && Objects.equals(this.contactValue, traineeContactListItem.contactValue);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, contactType, contactValue);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeContactListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
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
