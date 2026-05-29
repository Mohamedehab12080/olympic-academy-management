package bs.lib.common.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * LookupDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class LookupDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String titleAr;

    private String titleEn;

    public LookupDTO titleAr(String titleAr) {
        this.titleAr = titleAr;
        return this;
    }

    /**
     * Get titleAr
     *
     * @return titleAr
     */

    @Schema(name = "titleAr", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("titleAr")
    public String getTitleAr() {
        return titleAr;
    }

    public void setTitleAr(String titleAr) {
        this.titleAr = titleAr;
    }

    public LookupDTO titleEn(String titleEn) {
        this.titleEn = titleEn;
        return this;
    }

    /**
     * Get titleEn
     *
     * @return titleEn
     */
    @NotNull
    @Size(min = 1)
    @Schema(name = "titleEn", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("titleEn")
    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LookupDTO lookupDTO = (LookupDTO) o;
        return Objects.equals(this.titleAr, lookupDTO.titleAr) && Objects.equals(this.titleEn, lookupDTO.titleEn);
    }

    @Override
    public int hashCode() {
        return Objects.hash(titleAr, titleEn);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class LookupDTO {\n");
        sb.append("    titleAr: ").append(toIndentedString(titleAr)).append("\n");
        sb.append("    titleEn: ").append(toIndentedString(titleEn)).append("\n");
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
