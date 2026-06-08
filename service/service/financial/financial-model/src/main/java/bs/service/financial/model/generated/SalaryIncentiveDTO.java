package bs.service.financial.model.generated;

import bs.lib.common.model.enums.SalaryTypes;
import bs.service.financial.model.enums.SalaryTransactionType;
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
 * SalaryIncentiveDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class SalaryIncentiveDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer employeeId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate withdrawDate;

    private Integer amountWithdrawn;

    private Integer paymentMethodId;

    private String imageUrl;

    private SalaryTypes salaryType;

    private SalaryTransactionType salaryTransactionType;

    private String note;

    public SalaryIncentiveDTO employeeId(Integer employeeId) {
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

    public SalaryIncentiveDTO withdrawDate(LocalDate withdrawDate) {
        this.withdrawDate = withdrawDate;
        return this;
    }

    /**
     * Get withdrawDate
     *
     * @return withdrawDate
     */
    @NotNull
    @Valid
    @Schema(name = "withdrawDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("withdrawDate")
    public LocalDate getWithdrawDate() {
        return withdrawDate;
    }

    public void setWithdrawDate(LocalDate withdrawDate) {
        this.withdrawDate = withdrawDate;
    }

    public SalaryIncentiveDTO amountWithdrawn(Integer amountWithdrawn) {
        this.amountWithdrawn = amountWithdrawn;
        return this;
    }

    /**
     * Get amountWithdrawn
     *
     * @return amountWithdrawn
     */
    @NotNull
    @Schema(name = "amountWithdrawn", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("amountWithdrawn")
    public Integer getAmountWithdrawn() {
        return amountWithdrawn;
    }

    public void setAmountWithdrawn(Integer amountWithdrawn) {
        this.amountWithdrawn = amountWithdrawn;
    }

    public SalaryIncentiveDTO paymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
        return this;
    }

    /**
     * Get paymentMethodId
     *
     * @return paymentMethodId
     */

    @Schema(name = "paymentMethodId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentMethodId")
    public Integer getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public SalaryIncentiveDTO imageUrl(String imageUrl) {
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

    public SalaryIncentiveDTO salaryType(SalaryTypes salaryType) {
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

    public SalaryIncentiveDTO salaryTransactionType(SalaryTransactionType salaryTransactionType) {
        this.salaryTransactionType = salaryTransactionType;
        return this;
    }

    /**
     * Get salaryTransactionType
     *
     * @return salaryTransactionType
     */
    @NotNull
    @Valid
    @Schema(name = "salaryTransactionType", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("salaryTransactionType")
    public SalaryTransactionType getSalaryTransactionType() {
        return salaryTransactionType;
    }

    public void setSalaryTransactionType(SalaryTransactionType salaryTransactionType) {
        this.salaryTransactionType = salaryTransactionType;
    }

    public SalaryIncentiveDTO note(String note) {
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
        SalaryIncentiveDTO salaryIncentiveDTO = (SalaryIncentiveDTO) o;
        return Objects.equals(this.employeeId, salaryIncentiveDTO.employeeId)
                && Objects.equals(this.withdrawDate, salaryIncentiveDTO.withdrawDate)
                && Objects.equals(this.amountWithdrawn, salaryIncentiveDTO.amountWithdrawn)
                && Objects.equals(this.paymentMethodId, salaryIncentiveDTO.paymentMethodId)
                && Objects.equals(this.imageUrl, salaryIncentiveDTO.imageUrl)
                && Objects.equals(this.salaryType, salaryIncentiveDTO.salaryType)
                && Objects.equals(this.salaryTransactionType, salaryIncentiveDTO.salaryTransactionType)
                && Objects.equals(this.note, salaryIncentiveDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(employeeId, withdrawDate, amountWithdrawn, paymentMethodId, imageUrl, salaryType,
                salaryTransactionType, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SalaryIncentiveDTO {\n");
        sb.append("    employeeId: ").append(toIndentedString(employeeId)).append("\n");
        sb.append("    withdrawDate: ").append(toIndentedString(withdrawDate)).append("\n");
        sb.append("    amountWithdrawn: ").append(toIndentedString(amountWithdrawn)).append("\n");
        sb.append("    paymentMethodId: ").append(toIndentedString(paymentMethodId)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    salaryType: ").append(toIndentedString(salaryType)).append("\n");
        sb.append("    salaryTransactionType: ").append(toIndentedString(salaryTransactionType)).append("\n");
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
