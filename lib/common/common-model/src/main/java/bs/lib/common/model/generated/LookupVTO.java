package bs.lib.common.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * LookupVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class LookupVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String titleEn;

    private String titleAr;

    private String profileImageFid;

    public LookupVTO id(Long id) {
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
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LookupVTO titleEn(String titleEn) {
        this.titleEn = titleEn;
        return this;
    }

    /**
     * Get titleEn
     *
     * @return titleEn
     */

    @Schema(name = "titleEn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("titleEn")
    public String getTitleEn() {
        return titleEn;
    }

    public void setTitleEn(String titleEn) {
        this.titleEn = titleEn;
    }

    public LookupVTO titleAr(String titleAr) {
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

    public LookupVTO profileImageFid(String profileImageFid) {
        this.profileImageFid = profileImageFid;
        return this;
    }

    /**
     * Get profileImageFid
     *
     * @return profileImageFid
     */

    @Schema(name = "profileImageFid", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("profileImageFid")
    public String getProfileImageFid() {
        return profileImageFid;
    }

    public void setProfileImageFid(String profileImageFid) {
        this.profileImageFid = profileImageFid;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LookupVTO lookupVTO = (LookupVTO) o;
        return Objects.equals(this.id, lookupVTO.id) && Objects.equals(this.titleEn, lookupVTO.titleEn)
                && Objects.equals(this.titleAr, lookupVTO.titleAr)
                && Objects.equals(this.profileImageFid, lookupVTO.profileImageFid);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, titleEn, titleAr, profileImageFid);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class LookupVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    titleEn: ").append(toIndentedString(titleEn)).append("\n");
        sb.append("    titleAr: ").append(toIndentedString(titleAr)).append("\n");
        sb.append("    profileImageFid: ").append(toIndentedString(profileImageFid)).append("\n");
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
