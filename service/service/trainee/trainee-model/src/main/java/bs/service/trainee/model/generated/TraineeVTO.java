package bs.service.trainee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * TraineeVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String fullName;

    private String nationalId;

    private String academicYear;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birthDate;

    private LookupVTO gender;

    private Boolean isActive;

    private String address;

    private String imageUrl;

    @Valid
    private List<@Valid TraineeContactVTO> contacts = new ArrayList<>();

    @Valid
    private List<@Valid TraineeCertificateVTO> certificates = new ArrayList<>();

    @Valid
    private List<@Valid HealthConditionVTO> healthConditions = new ArrayList<>();

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public TraineeVTO id(Integer id) {
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

    public TraineeVTO fullName(String fullName) {
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

    public TraineeVTO nationalId(String nationalId) {
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

    public TraineeVTO academicYear(String academicYear) {
        this.academicYear = academicYear;
        return this;
    }

    /**
     * Get academicYear
     *
     * @return academicYear
     */

    @Schema(name = "academicYear", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("academicYear")
    public String getAcademicYear() {
        return academicYear;
    }

    public void setAcademicYear(String academicYear) {
        this.academicYear = academicYear;
    }

    public TraineeVTO birthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
        return this;
    }

    /**
     * Get birthDate
     *
     * @return birthDate
     */
    @Valid
    @Schema(name = "birthDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("birthDate")
    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }

    public TraineeVTO gender(LookupVTO gender) {
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

    public TraineeVTO isActive(Boolean isActive) {
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

    public TraineeVTO address(String address) {
        this.address = address;
        return this;
    }

    /**
     * Get address
     *
     * @return address
     */

    @Schema(name = "address", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public TraineeVTO imageUrl(String imageUrl) {
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

    public TraineeVTO contacts(List<@Valid TraineeContactVTO> contacts) {
        this.contacts = contacts;
        return this;
    }

    public TraineeVTO addContactsItem(TraineeContactVTO contactsItem) {
        if (this.contacts == null) {
            this.contacts = new ArrayList<>();
        }
        this.contacts.add(contactsItem);
        return this;
    }

    /**
     * Get contacts
     *
     * @return contacts
     */
    @Valid
    @Schema(name = "contacts", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("contacts")
    public List<@Valid TraineeContactVTO> getContacts() {
        return contacts;
    }

    public void setContacts(List<@Valid TraineeContactVTO> contacts) {
        this.contacts = contacts;
    }

    public TraineeVTO certificates(List<@Valid TraineeCertificateVTO> certificates) {
        this.certificates = certificates;
        return this;
    }

    public TraineeVTO addCertificatesItem(TraineeCertificateVTO certificatesItem) {
        if (this.certificates == null) {
            this.certificates = new ArrayList<>();
        }
        this.certificates.add(certificatesItem);
        return this;
    }

    /**
     * Get certificates
     *
     * @return certificates
     */
    @Valid
    @Schema(name = "certificates", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("certificates")
    public List<@Valid TraineeCertificateVTO> getCertificates() {
        return certificates;
    }

    public void setCertificates(List<@Valid TraineeCertificateVTO> certificates) {
        this.certificates = certificates;
    }

    public TraineeVTO healthConditions(List<@Valid HealthConditionVTO> healthConditions) {
        this.healthConditions = healthConditions;
        return this;
    }

    public TraineeVTO addHealthConditionsItem(HealthConditionVTO healthConditionsItem) {
        if (this.healthConditions == null) {
            this.healthConditions = new ArrayList<>();
        }
        this.healthConditions.add(healthConditionsItem);
        return this;
    }

    /**
     * Get healthConditions
     *
     * @return healthConditions
     */
    @Valid
    @Schema(name = "healthConditions", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("healthConditions")
    public List<@Valid HealthConditionVTO> getHealthConditions() {
        return healthConditions;
    }

    public void setHealthConditions(List<@Valid HealthConditionVTO> healthConditions) {
        this.healthConditions = healthConditions;
    }

    public TraineeVTO createdOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    /**
     * Get createdOn
     *
     * @return createdOn
     */
    @Valid
    @Schema(name = "createdOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdOn")
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public TraineeVTO createdBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    /**
     * Get createdBy
     *
     * @return createdBy
     */
    @Valid
    @Schema(name = "createdBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdBy")
    public LightUserVTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
    }

    public TraineeVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
        this.lastModifiedOn = lastModifiedOn;
        return this;
    }

    /**
     * Get lastModifiedOn
     *
     * @return lastModifiedOn
     */
    @Valid
    @Schema(name = "lastModifiedOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastModifiedOn")
    public LocalDateTime getLastModifiedOn() {
        return lastModifiedOn;
    }

    public void setLastModifiedOn(LocalDateTime lastModifiedOn) {
        this.lastModifiedOn = lastModifiedOn;
    }

    public TraineeVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    /**
     * Get lastModifiedBy
     *
     * @return lastModifiedBy
     */
    @Valid
    @Schema(name = "lastModifiedBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastModifiedBy")
    public LightUserVTO getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(LightUserVTO lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeVTO traineeVTO = (TraineeVTO) o;
        return Objects.equals(this.id, traineeVTO.id) && Objects.equals(this.fullName, traineeVTO.fullName)
                && Objects.equals(this.nationalId, traineeVTO.nationalId)
                && Objects.equals(this.academicYear, traineeVTO.academicYear)
                && Objects.equals(this.birthDate, traineeVTO.birthDate)
                && Objects.equals(this.gender, traineeVTO.gender) && Objects.equals(this.isActive, traineeVTO.isActive)
                && Objects.equals(this.address, traineeVTO.address)
                && Objects.equals(this.imageUrl, traineeVTO.imageUrl)
                && Objects.equals(this.contacts, traineeVTO.contacts)
                && Objects.equals(this.certificates, traineeVTO.certificates)
                && Objects.equals(this.healthConditions, traineeVTO.healthConditions)
                && Objects.equals(this.createdOn, traineeVTO.createdOn)
                && Objects.equals(this.createdBy, traineeVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, traineeVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, traineeVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fullName, nationalId, academicYear, birthDate, gender, isActive, address, imageUrl,
                contacts, certificates, healthConditions, createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    academicYear: ").append(toIndentedString(academicYear)).append("\n");
        sb.append("    birthDate: ").append(toIndentedString(birthDate)).append("\n");
        sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    address: ").append(toIndentedString(address)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    contacts: ").append(toIndentedString(contacts)).append("\n");
        sb.append("    certificates: ").append(toIndentedString(certificates)).append("\n");
        sb.append("    healthConditions: ").append(toIndentedString(healthConditions)).append("\n");
        sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
        sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
        sb.append("    lastModifiedOn: ").append(toIndentedString(lastModifiedOn)).append("\n");
        sb.append("    lastModifiedBy: ").append(toIndentedString(lastModifiedBy)).append("\n");
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
