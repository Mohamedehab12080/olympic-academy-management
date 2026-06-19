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
 * TraineeLookupVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeLookupVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String title;

    private String nationalId;

    private String imageUrl;

    public TraineeLookupVTO id(Integer id) {
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

    public TraineeLookupVTO title(String title) {
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

    public TraineeLookupVTO nationalId(String nationalId) {
        this.nationalId = nationalId;
        return this;
    }

    /**
     * Get nationalId
     *
     * @return nationalId
     */

    @Schema(name = "nationalId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("nationalId")
    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public TraineeLookupVTO imageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
        return this;
    }

    /**
     * Get imageUrl
     *
     * @return imageUrl
     */

    @Schema(name = "imageUrl", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("imageUrl")
    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeLookupVTO traineeLookupVTO = (TraineeLookupVTO) o;
        return Objects.equals(this.id, traineeLookupVTO.id) && Objects.equals(this.title, traineeLookupVTO.title)
                && Objects.equals(this.nationalId, traineeLookupVTO.nationalId)
                && Objects.equals(this.imageUrl, traineeLookupVTO.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, nationalId, imageUrl);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeLookupVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
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
