package bs.service.employee.model.generated;

import bs.lib.common.model.enums.SalaryTypes;
import bs.lib.common.model.generated.LookupVTO;
import bs.service.user.model.generated.Genders;
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
 * EmployeeVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String fullName;

    private String nationalId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate birthDate;

    private Genders gender;

    private Integer salary;

    private Integer remainedSalary;

    private SalaryTypes salaryType;

    private EmployeeTypes employeeType;

    private String imageUrl;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate hireDate;

    private Boolean isActive;

    @Valid
    private List<@Valid LookupVTO> departments = new ArrayList<>();

    @Valid
    private List<@Valid EmployeeContactVTO> contacts = new ArrayList<>();

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public EmployeeVTO id(Integer id) {
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

    public EmployeeVTO fullName(String fullName) {
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

    public EmployeeVTO nationalId(String nationalId) {
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

    public EmployeeVTO birthDate(LocalDate birthDate) {
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

    public EmployeeVTO gender(Genders gender) {
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
    public Genders getGender() {
        return gender;
    }

    public void setGender(Genders gender) {
        this.gender = gender;
    }

    public EmployeeVTO salary(Integer salary) {
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

    public EmployeeVTO remainedSalary(Integer remainedSalary) {
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

    public EmployeeVTO salaryType(SalaryTypes salaryType) {
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

    public EmployeeVTO employeeType(EmployeeTypes employeeType) {
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

    public EmployeeVTO imageUrl(String imageUrl) {
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

    public EmployeeVTO hireDate(LocalDate hireDate) {
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

    public EmployeeVTO isActive(Boolean isActive) {
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

    public EmployeeVTO departments(List<@Valid LookupVTO> departments) {
        this.departments = departments;
        return this;
    }

    public EmployeeVTO addDepartmentsItem(LookupVTO departmentsItem) {
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

    public EmployeeVTO contacts(List<@Valid EmployeeContactVTO> contacts) {
        this.contacts = contacts;
        return this;
    }

    public EmployeeVTO addContactsItem(EmployeeContactVTO contactsItem) {
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
    public List<@Valid EmployeeContactVTO> getContacts() {
        return contacts;
    }

    public void setContacts(List<@Valid EmployeeContactVTO> contacts) {
        this.contacts = contacts;
    }

    public EmployeeVTO createdOn(LocalDateTime createdOn) {
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

    public EmployeeVTO createdBy(LightUserVTO createdBy) {
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

    public EmployeeVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public EmployeeVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        EmployeeVTO employeeVTO = (EmployeeVTO) o;
        return Objects.equals(this.id, employeeVTO.id) && Objects.equals(this.fullName, employeeVTO.fullName)
                && Objects.equals(this.nationalId, employeeVTO.nationalId)
                && Objects.equals(this.birthDate, employeeVTO.birthDate)
                && Objects.equals(this.gender, employeeVTO.gender) && Objects.equals(this.salary, employeeVTO.salary)
                && Objects.equals(this.remainedSalary, employeeVTO.remainedSalary)
                && Objects.equals(this.salaryType, employeeVTO.salaryType)
                && Objects.equals(this.employeeType, employeeVTO.employeeType)
                && Objects.equals(this.imageUrl, employeeVTO.imageUrl)
                && Objects.equals(this.hireDate, employeeVTO.hireDate)
                && Objects.equals(this.isActive, employeeVTO.isActive)
                && Objects.equals(this.departments, employeeVTO.departments)
                && Objects.equals(this.contacts, employeeVTO.contacts)
                && Objects.equals(this.createdOn, employeeVTO.createdOn)
                && Objects.equals(this.createdBy, employeeVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, employeeVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, employeeVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fullName, nationalId, birthDate, gender, salary, remainedSalary, salaryType,
                employeeType, imageUrl, hireDate, isActive, departments, contacts, createdOn, createdBy, lastModifiedOn,
                lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    birthDate: ").append(toIndentedString(birthDate)).append("\n");
        sb.append("    gender: ").append(toIndentedString(gender)).append("\n");
        sb.append("    salary: ").append(toIndentedString(salary)).append("\n");
        sb.append("    remainedSalary: ").append(toIndentedString(remainedSalary)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
        sb.append("    employeeType: ").append(toIndentedString(employeeType)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    hireDate: ").append(toIndentedString(hireDate)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    departments: ").append(toIndentedString(departments)).append("\n");
        sb.append("    contacts: ").append(toIndentedString(contacts)).append("\n");
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
