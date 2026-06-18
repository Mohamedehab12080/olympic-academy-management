package bs.service.employee.model.generated;

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
 * EmployeeLookupVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeLookupVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String fullName;

    private String nationalId;

    private Integer salary;

    private Integer remainedSalary;

    private LookupVTO salaryType;

    private LookupVTO employeeType;

    private String imageUrl;

    public EmployeeLookupVTO id(Integer id) {
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

    public EmployeeLookupVTO fullName(String fullName) {
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

    public EmployeeLookupVTO nationalId(String nationalId) {
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

    public EmployeeLookupVTO salary(Integer salary) {
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

    public EmployeeLookupVTO remainedSalary(Integer remainedSalary) {
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

    public EmployeeLookupVTO salaryType(LookupVTO salaryType) {
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
    public LookupVTO getSalaryType() {
        return salaryType;
    }

    public void setSalaryType(LookupVTO salaryType) {
        this.salaryType = salaryType;
    }

    public EmployeeLookupVTO employeeType(LookupVTO employeeType) {
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

    public EmployeeLookupVTO imageUrl(String imageUrl) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EmployeeLookupVTO employeeLookupVTO = (EmployeeLookupVTO) o;
        return Objects.equals(this.id, employeeLookupVTO.id)
                && Objects.equals(this.fullName, employeeLookupVTO.fullName)
                && Objects.equals(this.nationalId, employeeLookupVTO.nationalId)
                && Objects.equals(this.salary, employeeLookupVTO.salary)
                && Objects.equals(this.remainedSalary, employeeLookupVTO.remainedSalary)
                && Objects.equals(this.salaryType, employeeLookupVTO.salaryType)
                && Objects.equals(this.employeeType, employeeLookupVTO.employeeType)
                && Objects.equals(this.imageUrl, employeeLookupVTO.imageUrl);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fullName, nationalId, salary, remainedSalary, salaryType, employeeType, imageUrl);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeLookupVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    fullName: ").append(toIndentedString(fullName)).append("\n");
        sb.append("    nationalId: ").append(toIndentedString(nationalId)).append("\n");
        sb.append("    salary: ").append(toIndentedString(salary)).append("\n");
        sb.append("    remainedSalary: ").append(toIndentedString(remainedSalary)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
        sb.append("    employeeType: ").append(toIndentedString(employeeType)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
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
