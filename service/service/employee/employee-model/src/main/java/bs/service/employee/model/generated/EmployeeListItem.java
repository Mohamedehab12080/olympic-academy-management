package bs.service.employee.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * EmployeeListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String fullName;

    private String nationalId;

    private LookupVTO gender;

    private LookupVTO employeeType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate hireDate;

    private String imageUrl;

    private Boolean isActive;

    private Boolean isMonthlyUpdated;

    private Integer updatePeriodInDays;

    private Integer salary;

    private Integer remainedSalary;

    public EmployeeListItem id(Integer id) {
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

    public EmployeeListItem fullName(String fullName) {
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

    public EmployeeListItem nationalId(String nationalId) {
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

    public EmployeeListItem gender(LookupVTO gender) {
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

    public EmployeeListItem employeeType(LookupVTO employeeType) {
        this.employeeType = employeeType;
        return this;
    }

    /**
     * Get employeeType
     *
     * @return employeeType
     */
    @Valid
    @Schema(name = "employeeType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("employeeType")
    public LookupVTO getEmployeeType() {
        return employeeType;
    }

    public void setEmployeeType(LookupVTO employeeType) {
        this.employeeType = employeeType;
    }

    public EmployeeListItem hireDate(LocalDate hireDate) {
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

    public EmployeeListItem imageUrl(String imageUrl) {
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

    public EmployeeListItem isActive(Boolean isActive) {
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

    public EmployeeListItem isMonthlyUpdated(Boolean isMonthlyUpdated) {
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

    public EmployeeListItem updatePeriodInDays(Integer updatePeriodInDays) {
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

    public EmployeeListItem salary(Integer salary) {
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

    public EmployeeListItem remainedSalary(Integer remainedSalary) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EmployeeListItem employeeListItem = (EmployeeListItem) o;
        return Objects.equals(this.id, employeeListItem.id) && Objects.equals(this.fullName, employeeListItem.fullName)
                && Objects.equals(this.nationalId, employeeListItem.nationalId)
                && Objects.equals(this.gender, employeeListItem.gender)
                && Objects.equals(this.employeeType, employeeListItem.employeeType)
                && Objects.equals(this.hireDate, employeeListItem.hireDate)
                && Objects.equals(this.imageUrl, employeeListItem.imageUrl)
                && Objects.equals(this.isActive, employeeListItem.isActive)
                && Objects.equals(this.isMonthlyUpdated, employeeListItem.isMonthlyUpdated)
                && Objects.equals(this.updatePeriodInDays, employeeListItem.updatePeriodInDays)
                && Objects.equals(this.salary, employeeListItem.salary)
                && Objects.equals(this.remainedSalary, employeeListItem.remainedSalary);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fullName, nationalId, gender, employeeType, hireDate, imageUrl, isActive,
                isMonthlyUpdated, updatePeriodInDays, salary, remainedSalary);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
        sb.append("    employeeType: ").append(toIndentedString(employeeType)).append("\n");
        sb.append("    hireDate: ").append(toIndentedString(hireDate)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    isMonthlyUpdated: ").append(toIndentedString(isMonthlyUpdated)).append("\n");
        sb.append("    updatePeriodInDays: ").append(toIndentedString(updatePeriodInDays)).append("\n");
        sb.append("    salary: ").append(toIndentedString(salary)).append("\n");
        sb.append("    remainedSalary: ").append(toIndentedString(remainedSalary)).append("\n");
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
