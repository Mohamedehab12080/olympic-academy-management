package bs.service.place.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * ConstantDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class ConstantDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private String value;

    private String location;

    private String position;

    public ConstantDTO title(String title) {
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

    public ConstantDTO value(String value) {
        this.value = value;
        return this;
    }

    /**
     * Get value
     *
     * @return value
     */
    @NotNull
    @Schema(name = "value", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("value")
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ConstantDTO location(String location) {
        this.location = location;
        return this;
    }

    /**
     * Get location
     *
     * @return location
     */

    @Schema(name = "location", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("location")
    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public ConstantDTO position(String position) {
        this.position = position;
        return this;
    }

    /**
     * Get position
     *
     * @return position
     */

    @Schema(name = "position", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("position")
    public String getPosition() {
        return position;
    }

    public void setPosition(String position) {
        this.position = position;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ConstantDTO constantDTO = (ConstantDTO) o;
        return Objects.equals(this.title, constantDTO.title) && Objects.equals(this.value, constantDTO.value)
                && Objects.equals(this.location, constantDTO.location)
                && Objects.equals(this.position, constantDTO.position);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, value, location, position);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ConstantDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    value: ").append(toIndentedString(value)).append("\n");
        sb.append("    location: ").append(toIndentedString(location)).append("\n");
        sb.append("    position: ").append(toIndentedString(position)).append("\n");
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
