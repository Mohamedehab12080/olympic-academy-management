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
 * ConstantListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class ConstantListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String title;

    private String value;

    private String location;

    private String position;

    public ConstantListItem id(Integer id) {
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

    public ConstantListItem title(String title) {
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

    public ConstantListItem value(String value) {
        this.value = value;
        return this;
    }

    /**
     * Get value
     *
     * @return value
     */

    @Schema(name = "value", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("value")
    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public ConstantListItem location(String location) {
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

    public ConstantListItem position(String position) {
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
        ConstantListItem constantListItem = (ConstantListItem) o;
        return Objects.equals(this.id, constantListItem.id) && Objects.equals(this.title, constantListItem.title)
                && Objects.equals(this.value, constantListItem.value)
                && Objects.equals(this.location, constantListItem.location)
                && Objects.equals(this.position, constantListItem.position);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, value, location, position);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ConstantListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
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
