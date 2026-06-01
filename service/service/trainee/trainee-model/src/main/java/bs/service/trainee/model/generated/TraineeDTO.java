package bs.service.trainee.model.generated;

import bs.lib.common.model.enums.Gender;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * TraineeDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String fullName;

    private String nationalId;

    private String academicYear;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birthDate;

    private Gender gender;

    private String address;

    private String imageUrl;

    @Valid
    private List<@Valid TraineeContactDTO> contacts = new ArrayList<>();

    public TraineeDTO fullName(String fullName) {
        this.fullName = fullName;
        return this;
    }

    /**
     * Get fullName
     *
     * @return fullName
     */
    @NotNull
    @Schema(name = "fullName", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("fullName")
    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public TraineeDTO nationalId(String nationalId) {
        this.nationalId = nationalId;
        return this;
    }

    /**
     * Get nationalId
     *
     * @return nationalId
     */
    @NotNull
    @Schema(name = "nationalId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("nationalId")
    public String getNationalId() {
        return nationalId;
    }

    public void setNationalId(String nationalId) {
        this.nationalId = nationalId;
    }

    public TraineeDTO academicYear(String academicYear) {
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

    public TraineeDTO birthDate(LocalDate birthDate) {
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

    public TraineeDTO gender(Gender gender) {
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
    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public TraineeDTO address(String address) {
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

    public TraineeDTO imageUrl(String imageUrl) {
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

    public TraineeDTO contacts(List<@Valid TraineeContactDTO> contacts) {
        this.contacts = contacts;
        return this;
    }

    public TraineeDTO addContactsItem(TraineeContactDTO contactsItem) {
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
    public List<@Valid TraineeContactDTO> getContacts() {
        return contacts;
    }

    public void setContacts(List<@Valid TraineeContactDTO> contacts) {
        this.contacts = contacts;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeDTO traineeDTO = (TraineeDTO) o;
        return Objects.equals(this.fullName, traineeDTO.fullName)
                && Objects.equals(this.nationalId, traineeDTO.nationalId)
                && Objects.equals(this.academicYear, traineeDTO.academicYear)
                && Objects.equals(this.birthDate, traineeDTO.birthDate)
                && Objects.equals(this.gender, traineeDTO.gender) && Objects.equals(this.address, traineeDTO.address)
                && Objects.equals(this.imageUrl, traineeDTO.imageUrl)
                && Objects.equals(this.contacts, traineeDTO.contacts);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fullName, nationalId, academicYear, birthDate, gender, address, imageUrl, contacts);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeDTO {\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    academicYear: ").append(toIndentedString(academicYear)).append("\n");
        sb.append("    birthDate: ").append(toIndentedString(birthDate)).append("\n");
        sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
        sb.append("    address: ").append(toIndentedString(address)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    contacts: ").append(toIndentedString(contacts)).append("\n");
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
