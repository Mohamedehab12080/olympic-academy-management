package bs.service.financial.model.generated;

import bs.lib.common.model.enums.SalaryTypes;
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
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * SalaryDeductionVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class SalaryDeductionVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LookupVTO employee;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate deductionDate;

    private Integer amountDeducted;

    private String imageUrl;

    private String reason;

    private SalaryTypes salaryType;

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public SalaryDeductionVTO id(Integer id) {
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

    public SalaryDeductionVTO employee(LookupVTO employee) {
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
    public LookupVTO getEmployee() {
        return employee;
    }

    public void setEmployee(LookupVTO employee) {
        this.employee = employee;
    }

    public SalaryDeductionVTO deductionDate(LocalDate deductionDate) {
        this.deductionDate = deductionDate;
        return this;
    }

    /**
     * Get deductionDate
     *
     * @return deductionDate
     */
    @Valid
    @Schema(name = "deductionDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("deductionDate")
    public LocalDate getDeductionDate() {
        return deductionDate;
    }

    public void setDeductionDate(LocalDate deductionDate) {
        this.deductionDate = deductionDate;
    }

    public SalaryDeductionVTO amountDeducted(Integer amountDeducted) {
        this.amountDeducted = amountDeducted;
        return this;
    }

    /**
     * Get amountDeducted
     *
     * @return amountDeducted
     */

    @Schema(name = "amountDeducted", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("amountDeducted")
    public Integer getAmountDeducted() {
        return amountDeducted;
    }

    public void setAmountDeducted(Integer amountDeducted) {
        this.amountDeducted = amountDeducted;
    }

    public SalaryDeductionVTO imageUrl(String imageUrl) {
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

    public SalaryDeductionVTO reason(String reason) {
        this.reason = reason;
        return this;
    }

    /**
     * Get reason
     *
     * @return reason
     */

    @Schema(name = "reason", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("reason")
    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public SalaryDeductionVTO salaryType(SalaryTypes salaryType) {
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

    public SalaryDeductionVTO note(String note) {
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

    public SalaryDeductionVTO createdOn(LocalDateTime createdOn) {
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

    public SalaryDeductionVTO createdBy(LightUserVTO createdBy) {
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

    public SalaryDeductionVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public SalaryDeductionVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        SalaryDeductionVTO salaryDeductionVTO = (SalaryDeductionVTO) o;
        return Objects.equals(this.id, salaryDeductionVTO.id)
                && Objects.equals(this.employee, salaryDeductionVTO.employee)
                && Objects.equals(this.deductionDate, salaryDeductionVTO.deductionDate)
                && Objects.equals(this.amountDeducted, salaryDeductionVTO.amountDeducted)
                && Objects.equals(this.imageUrl, salaryDeductionVTO.imageUrl)
                && Objects.equals(this.reason, salaryDeductionVTO.reason)
                && Objects.equals(this.salaryType, salaryDeductionVTO.salaryType)
                && Objects.equals(this.note, salaryDeductionVTO.note)
                && Objects.equals(this.createdOn, salaryDeductionVTO.createdOn)
                && Objects.equals(this.createdBy, salaryDeductionVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, salaryDeductionVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, salaryDeductionVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, employee, deductionDate, amountDeducted, imageUrl, reason, salaryType, note, createdOn,
                createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SalaryDeductionVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    employee: ").append(toIndentedString(employee)).append("\n");
        sb.append("    deductionDate: ").append(toIndentedString(deductionDate)).append("\n");
        sb.append("    amountDeducted: ").append(toIndentedString(amountDeducted)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    reason: ").append(toIndentedString(reason)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
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
