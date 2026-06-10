package bs.service.financial.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.employee.model.generated.EmployeeVTO;
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
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * SalaryIncentiveVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class SalaryIncentiveVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private EmployeeVTO employee;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate withdrawDate;

    private Integer amountWithdrawn;

    private LookupVTO paymentMethod;

    private String imageUrl;

    private LookupVTO salaryType;

    private LookupVTO salaryTransactionType;

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public SalaryIncentiveVTO id(Integer id) {
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

    public SalaryIncentiveVTO employee(EmployeeVTO employee) {
        this.employee = employee;
        return this;
    }

    /**
     * Get employee
     *
     * @return employee
     */
    @Valid
    @Schema(name = "employee", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("employee")
    public EmployeeVTO getEmployee() {
        return employee;
    }

    public void setEmployee(EmployeeVTO employee) {
        this.employee = employee;
    }

    public SalaryIncentiveVTO withdrawDate(LocalDate withdrawDate) {
        this.withdrawDate = withdrawDate;
        return this;
    }

    /**
     * Get withdrawDate
     *
     * @return withdrawDate
     */
    @Valid
    @Schema(name = "withdrawDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("withdrawDate")
    public LocalDate getWithdrawDate() {
        return withdrawDate;
    }

    public void setWithdrawDate(LocalDate withdrawDate) {
        this.withdrawDate = withdrawDate;
    }

    public SalaryIncentiveVTO amountWithdrawn(Integer amountWithdrawn) {
        this.amountWithdrawn = amountWithdrawn;
        return this;
    }

    /**
     * Get amountWithdrawn
     *
     * @return amountWithdrawn
     */

    @Schema(name = "amountWithdrawn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("amountWithdrawn")
    public Integer getAmountWithdrawn() {
        return amountWithdrawn;
    }

    public void setAmountWithdrawn(Integer amountWithdrawn) {
        this.amountWithdrawn = amountWithdrawn;
    }

    public SalaryIncentiveVTO paymentMethod(LookupVTO paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;
    }

    /**
     * Get paymentMethod
     *
     * @return paymentMethod
     */
    @Valid
    @Schema(name = "paymentMethod", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentMethod")
    public LookupVTO getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(LookupVTO paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public SalaryIncentiveVTO imageUrl(String imageUrl) {
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

    public SalaryIncentiveVTO salaryType(LookupVTO salaryType) {
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

    public SalaryIncentiveVTO salaryTransactionType(LookupVTO salaryTransactionType) {
        this.salaryTransactionType = salaryTransactionType;
        return this;
    }

    /**
     * Get salaryTransactionType
     *
     * @return salaryTransactionType
     */
    @Valid
    @Schema(name = "salaryTransactionType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("salaryTransactionType")
    public LookupVTO getSalaryTransactionType() {
        return salaryTransactionType;
    }

    public void setSalaryTransactionType(LookupVTO salaryTransactionType) {
        this.salaryTransactionType = salaryTransactionType;
    }

    public SalaryIncentiveVTO note(String note) {
        this.note = note;
        return this;
    }

    /**
     * Get note
     *
     * @return note
     */

    @Schema(name = "note", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("note")
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public SalaryIncentiveVTO createdOn(LocalDateTime createdOn) {
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

    public SalaryIncentiveVTO createdBy(LightUserVTO createdBy) {
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

    public SalaryIncentiveVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public SalaryIncentiveVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        SalaryIncentiveVTO salaryIncentiveVTO = (SalaryIncentiveVTO) o;
        return Objects.equals(this.id, salaryIncentiveVTO.id)
                && Objects.equals(this.employee, salaryIncentiveVTO.employee)
                && Objects.equals(this.withdrawDate, salaryIncentiveVTO.withdrawDate)
                && Objects.equals(this.amountWithdrawn, salaryIncentiveVTO.amountWithdrawn)
                && Objects.equals(this.paymentMethod, salaryIncentiveVTO.paymentMethod)
                && Objects.equals(this.imageUrl, salaryIncentiveVTO.imageUrl)
                && Objects.equals(this.salaryType, salaryIncentiveVTO.salaryType)
                && Objects.equals(this.salaryTransactionType, salaryIncentiveVTO.salaryTransactionType)
                && Objects.equals(this.note, salaryIncentiveVTO.note)
                && Objects.equals(this.createdOn, salaryIncentiveVTO.createdOn)
                && Objects.equals(this.createdBy, salaryIncentiveVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, salaryIncentiveVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, salaryIncentiveVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, employee, withdrawDate, amountWithdrawn, paymentMethod, imageUrl, salaryType,
                salaryTransactionType, note, createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SalaryIncentiveVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    employee: ").append(toIndentedString(employee)).append("\n");
        sb.append("    withdrawDate: ").append(toIndentedString(withdrawDate)).append("\n");
        sb.append("    amountWithdrawn: ").append(toIndentedString(amountWithdrawn)).append("\n");
        sb.append("    paymentMethod: ").append(toIndentedString(paymentMethod)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
        sb.append("    salaryTransactionType: ").append(toIndentedString(salaryTransactionType)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
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
