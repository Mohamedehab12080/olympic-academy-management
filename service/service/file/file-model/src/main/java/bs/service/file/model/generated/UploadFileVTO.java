package bs.service.file.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * UploadFileVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class UploadFileVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String fid;

    public UploadFileVTO fid(String fid) {
        this.fid = fid;
        return this;
    }

    /**
     * The unique identifier 15 or 18 digit of the uploaded file
     *
     * @return fid
     */

    @Schema(name = "fid", example = "100125082300001 or 100125082300001001", description = "The unique identifier 15 or 18 digit of the uploaded file", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("fid")
    public String getFid() {
        return fid;
    }

    public void setFid(String fid) {
        this.fid = fid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        UploadFileVTO uploadFileVTO = (UploadFileVTO) o;
        return Objects.equals(this.fid, uploadFileVTO.fid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fid);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class UploadFileVTO {\n");
        sb.append("    fid: ").append(toIndentedString(fid)).append("\n");
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
