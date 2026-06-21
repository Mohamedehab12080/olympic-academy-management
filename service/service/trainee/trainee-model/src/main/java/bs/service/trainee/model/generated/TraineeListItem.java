package bs.service.trainee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
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
 * TraineeListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String fullName;

    private String imageUrl;

    private String nationalId;

    private Boolean isActive;

    private LookupVTO academicYear;

    private LookupVTO gender;

    public TraineeListItem id(Integer id) {
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

    public TraineeListItem fullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    /**
     * Get fullName
     *
     * @return fullName
     */

    @Schema(name = "fullName", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("fullName")
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public TraineeListItem imageUrl(String imageUrl) {
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

    public TraineeListItem nationalId(String nationalId) {
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

    public TraineeListItem isActive(Boolean isActive) {
        this.isActive = isActive;
        return this;
    }

    /**
     * Get isActive
     *
     * @return isActive
     */

    @Schema(name = "isActive", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("isActive")
    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public TraineeListItem academicYear(LookupVTO academicYear) {
        this.academicYear = academicYear;
        return this;
    }

    /**
     * Get academicYear
     *
     * @return academicYear
     */
    @Valid
    @Schema(name = "academicYear", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("academicYear")
    public LookupVTO getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(LookupVTO academicYear) {
        this.academicYear = academicYear;
    }

    public TraineeListItem gender(LookupVTO gender) {
        this.gender = gender;
        return this;
    }

    /**
     * Get gender
     *
     * @return gender
     */
    @Valid
    @Schema(name = "gender", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("gender")
    public LookupVTO getGender() {
        return gender;
    }

    public void setGender(LookupVTO gender) {
        this.gender = gender;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeListItem traineeListItem = (TraineeListItem) o;
        return Objects.equals(this.id, traineeListItem.id) && Objects.equals(this.fullName, traineeListItem.fullName)
                && Objects.equals(this.imageUrl, traineeListItem.imageUrl)
                && Objects.equals(this.nationalId, traineeListItem.nationalId)
                && Objects.equals(this.isActive, traineeListItem.isActive)
                && Objects.equals(this.academicYear, traineeListItem.academicYear)
                && Objects.equals(this.gender, traineeListItem.gender);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fullName, imageUrl, nationalId, isActive, academicYear, gender);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    academicYear: ").append(toIndentedString(academicYear)).append("\n");
        sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
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
