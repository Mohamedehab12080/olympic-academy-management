package bs.service.financial.model.generated;

import bs.lib.common.model.enums.SalaryTypes;
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
 * SalaryDeductionDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class SalaryDeductionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer employeeId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate deductionDate;

    private Integer amountDeducted;

    private String imageUrl;

    private String reason;

    private SalaryTypes salaryType;

    private String note;

    public SalaryDeductionDTO employeeId(Integer employeeId) {
        this.employeeId = employeeId;
        return this;
    }

    /**
     * Get employeeId
     *
     * @return employeeId
     */
    @NotNull
    @Schema(name = "employeeId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("employeeId")
    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public SalaryDeductionDTO deductionDate(LocalDate deductionDate) {
        this.deductionDate = deductionDate;
        return this;
    }

    /**
     * Get deductionDate
     *
     * @return deductionDate
     */
    @NotNull
    @Valid
    @Schema(name = "deductionDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("deductionDate")
    public LocalDate getDeductionDate() {
        return deductionDate;
    }

    public void setDeductionDate(LocalDate deductionDate) {
        this.deductionDate = deductionDate;
    }

    public SalaryDeductionDTO amountDeducted(Integer amountDeducted) {
        this.amountDeducted = amountDeducted;
        return this;
    }

    /**
     * Get amountDeducted
     *
     * @return amountDeducted
     */
    @NotNull
    @Schema(name = "amountDeducted", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("amountDeducted")
    public Integer getAmountDeducted() {
        return amountDeducted;
    }

    public void setAmountDeducted(Integer amountDeducted) {
        this.amountDeducted = amountDeducted;
    }

    public SalaryDeductionDTO imageUrl(String imageUrl) {
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

    public SalaryDeductionDTO reason(String reason) {
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

    public SalaryDeductionDTO salaryType(SalaryTypes salaryType) {
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

    public SalaryDeductionDTO note(String note) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SalaryDeductionDTO salaryDeductionDTO = (SalaryDeductionDTO) o;
        return Objects.equals(this.employeeId, salaryDeductionDTO.employeeId)
                && Objects.equals(this.deductionDate, salaryDeductionDTO.deductionDate)
                && Objects.equals(this.amountDeducted, salaryDeductionDTO.amountDeducted)
                && Objects.equals(this.imageUrl, salaryDeductionDTO.imageUrl)
                && Objects.equals(this.reason, salaryDeductionDTO.reason)
                && Objects.equals(this.salaryType, salaryDeductionDTO.salaryType)
                && Objects.equals(this.note, salaryDeductionDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeId, deductionDate, amountDeducted, imageUrl, reason, salaryType, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SalaryDeductionDTO {\n");
        sb.append("    employeeId: ").append(toIndentedString(employeeId)).append("\n");
        sb.append("    deductionDate: ").append(toIndentedString(deductionDate)).append("\n");
        sb.append("    amountDeducted: ").append(toIndentedString(amountDeducted)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    reason: ").append(toIndentedString(reason)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
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
