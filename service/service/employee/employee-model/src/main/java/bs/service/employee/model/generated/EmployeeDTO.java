package bs.service.employee.model.generated;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.service.employee.model.enums.EmployeeTypes;
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
 * EmployeeDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String fullName;

    private String nationalId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birthDate;

    private Gender gender;

    private Integer salary;

    private Integer remainedSalary;

    private SalaryTypes salaryType;

    private EmployeeTypes employeeType;

    private Boolean isActive;

    private Boolean isMonthlyUpdated;

    private Integer updatePeriodInDays;

    private String imageUrl;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate hireDate;

    @Valid
    private List<Integer> departmentIds = new ArrayList<>();

    @Valid
    private List<@Valid EmployeeContactDTO> contacts = new ArrayList<>();

    public EmployeeDTO fullName(String fullName) {
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

    public EmployeeDTO nationalId(String nationalId) {
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

    public EmployeeDTO birthDate(LocalDate birthDate) {
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

    public EmployeeDTO gender(Gender gender) {
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

    public EmployeeDTO salary(Integer salary) {
        this.salary = salary;
        return this;
    }

    /**
     * Get salary
     *
     * @return salary
     */

    @Schema(name = "salary", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("salary")
    public Integer getSalary() {
        return salary;
    }

    public void setSalary(Integer salary) {
        this.salary = salary;
    }

    public EmployeeDTO remainedSalary(Integer remainedSalary) {
        this.remainedSalary = remainedSalary;
        return this;
    }

    /**
     * Get remainedSalary
     *
     * @return remainedSalary
     */

    @Schema(name = "remainedSalary", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("remainedSalary")
    public Integer getRemainedSalary() {
        return remainedSalary;
    }

    public void setRemainedSalary(Integer remainedSalary) {
        this.remainedSalary = remainedSalary;
    }

    public EmployeeDTO salaryType(SalaryTypes salaryType) {
        this.salaryType = salaryType;
        return this;
    }

    /**
     * Get salaryType
     *
     * @return salaryType
     */
    @Valid
    @Schema(name = "salaryType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("salaryType")
    public SalaryTypes getSalaryType() {
        return salaryType;
    }

    public void setSalaryType(SalaryTypes salaryType) {
        this.salaryType = salaryType;
    }

    public EmployeeDTO employeeType(EmployeeTypes employeeType) {
        this.employeeType = employeeType;
        return this;
    }

    /**
     * Get employeeType
     *
     * @return employeeType
     */
    @NotNull
    @Valid
    @Schema(name = "employeeType", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("employeeType")
    public EmployeeTypes getEmployeeType() {
        return employeeType;
    }

    public void setEmployeeType(EmployeeTypes employeeType) {
        this.employeeType = employeeType;
    }

    public EmployeeDTO isActive(Boolean isActive) {
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

    public EmployeeDTO isMonthlyUpdated(Boolean isMonthlyUpdated) {
        this.isMonthlyUpdated = isMonthlyUpdated;
        return this;
    }

    /**
     * Get isMonthlyUpdated
     *
     * @return isMonthlyUpdated
     */

    @Schema(name = "isMonthlyUpdated", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("isMonthlyUpdated")
    public Boolean getIsMonthlyUpdated() {
        return isMonthlyUpdated;
    }

    public void setIsMonthlyUpdated(Boolean isMonthlyUpdated) {
        this.isMonthlyUpdated = isMonthlyUpdated;
    }

    public EmployeeDTO updatePeriodInDays(Integer updatePeriodInDays) {
        this.updatePeriodInDays = updatePeriodInDays;
        return this;
    }

    /**
     * Get updatePeriodInDays
     *
     * @return updatePeriodInDays
     */

    @Schema(name = "updatePeriodInDays", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("updatePeriodInDays")
    public Integer getUpdatePeriodInDays() {
        return updatePeriodInDays;
    }

    public void setUpdatePeriodInDays(Integer updatePeriodInDays) {
        this.updatePeriodInDays = updatePeriodInDays;
    }

    public EmployeeDTO imageUrl(String imageUrl) {
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

    public EmployeeDTO hireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
        return this;
    }

    /**
     * Get hireDate
     *
     * @return hireDate
     */
    @Valid
    @Schema(name = "hireDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("hireDate")
    public LocalDate getHireDate() {
        return hireDate;
    }

    public void setHireDate(LocalDate hireDate) {
        this.hireDate = hireDate;
    }

    public EmployeeDTO departmentIds(List<Integer> departmentIds) {
        this.departmentIds = departmentIds;
        return this;
    }

    public EmployeeDTO addDepartmentIdsItem(Integer departmentIdsItem) {
        if (this.departmentIds == null) {
            this.departmentIds = new ArrayList<>();
        }
        this.departmentIds.add(departmentIdsItem);
        return this;
    }

    /**
     * Get departmentIds
     *
     * @return departmentIds
     */
    @NotNull
    @Schema(name = "departmentIds", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("departmentIds")
    public List<Integer> getDepartmentIds() {
        return departmentIds;
    }

    public void setDepartmentIds(List<Integer> departmentIds) {
        this.departmentIds = departmentIds;
    }

    public EmployeeDTO contacts(List<@Valid EmployeeContactDTO> contacts) {
        this.contacts = contacts;
        return this;
    }

    public EmployeeDTO addContactsItem(EmployeeContactDTO contactsItem) {
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
    @NotNull
    @Valid
    @Schema(name = "contacts", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("contacts")
    public List<@Valid EmployeeContactDTO> getContacts() {
        return contacts;
    }

    public void setContacts(List<@Valid EmployeeContactDTO> contacts) {
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
        EmployeeDTO employeeDTO = (EmployeeDTO) o;
        return Objects.equals(this.fullName, employeeDTO.fullName)
                && Objects.equals(this.nationalId, employeeDTO.nationalId)
                && Objects.equals(this.birthDate, employeeDTO.birthDate)
                && Objects.equals(this.gender, employeeDTO.gender) && Objects.equals(this.salary, employeeDTO.salary)
                && Objects.equals(this.remainedSalary, employeeDTO.remainedSalary)
                && Objects.equals(this.salaryType, employeeDTO.salaryType)
                && Objects.equals(this.employeeType, employeeDTO.employeeType)
                && Objects.equals(this.isActive, employeeDTO.isActive)
                && Objects.equals(this.isMonthlyUpdated, employeeDTO.isMonthlyUpdated)
                && Objects.equals(this.updatePeriodInDays, employeeDTO.updatePeriodInDays)
                && Objects.equals(this.imageUrl, employeeDTO.imageUrl)
                && Objects.equals(this.hireDate, employeeDTO.hireDate)
                && Objects.equals(this.departmentIds, employeeDTO.departmentIds)
                && Objects.equals(this.contacts, employeeDTO.contacts);
    }

    @Override
    public int hashCode() {
        return Objects.hash(fullName, nationalId, birthDate, gender, salary, remainedSalary, salaryType, employeeType,
                isActive, isMonthlyUpdated, updatePeriodInDays, imageUrl, hireDate, departmentIds, contacts);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeDTO {\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    birthDate: ").append(toIndentedString(birthDate)).append("\n");
        sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
        sb.append("    salary: ").append(toIndentedString(salary)).append("\n");
        sb.append("    remainedSalary: ").append(toIndentedString(remainedSalary)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
        sb.append("    employeeType: ").append(toIndentedString(employeeType)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    isMonthlyUpdated: ").append(toIndentedString(isMonthlyUpdated)).append("\n");
        sb.append("    updatePeriodInDays: ").append(toIndentedString(updatePeriodInDays)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    hireDate: ").append(toIndentedString(hireDate)).append("\n");
        sb.append("    departmentIds: ").append(toIndentedString(departmentIds)).append("\n");
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
