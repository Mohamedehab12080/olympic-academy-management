package bs.service.employee.model.generated;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.generated.LookupVTO;
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

    private Gender gender;

    private EmployeeTypes employeeType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate hireDate;

    private Boolean isActive;

    @Valid
    private List<@Valid LookupVTO> departments = new ArrayList<>();

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

    public EmployeeListItem gender(Gender gender) {
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

    public EmployeeListItem employeeType(EmployeeTypes employeeType) {
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
    public EmployeeTypes getEmployeeType() {
        return employeeType;
    }

    public void setEmployeeType(EmployeeTypes employeeType) {
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

    public EmployeeListItem departments(List<@Valid LookupVTO> departments) {
        this.departments = departments;
        return this;
    }

    public EmployeeListItem addDepartmentsItem(LookupVTO departmentsItem) {
        if (this.departments == null) {
            this.departments = new ArrayList<>();
        }
        this.departments.add(departmentsItem);
        return this;
    }

    /**
     * Get departments
     *
     * @return departments
     */
    @Valid
    @Schema(name = "departments", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("departments")
    public List<@Valid LookupVTO> getDepartments() {
        return departments;
    }

    public void setDepartments(List<@Valid LookupVTO> departments) {
        this.departments = departments;
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
                && Objects.equals(this.isActive, employeeListItem.isActive)
                && Objects.equals(this.departments, employeeListItem.departments);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fullName, nationalId, gender, employeeType, hireDate, isActive, departments);
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
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    departments: ").append(toIndentedString(departments)).append("\n");
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
