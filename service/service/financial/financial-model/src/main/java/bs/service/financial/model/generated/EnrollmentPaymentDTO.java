package bs.service.financial.model.generated;

import bs.lib.common.model.enums.PaymentStatus;
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
 * EnrollmentPaymentDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentPaymentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer enrollmentId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate paymentDate;

    private Integer enrollmentValue;

    private Integer paidAmount;

    private Integer remainedValue;

    private Integer paymentMethodId;

    private String imageUrl;

    private String note;

    private PaymentStatus paymentStatus;

    public EnrollmentPaymentDTO enrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
        return this;
    }

    /**
     * Get enrollmentId
     *
     * @return enrollmentId
     */
    @NotNull
    @Schema(name = "enrollmentId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("enrollmentId")
    public Integer getEnrollmentId() {
        return enrollmentId;
    }

    public void setEnrollmentId(Integer enrollmentId) {
        this.enrollmentId = enrollmentId;
    }

    public EnrollmentPaymentDTO paymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
        return this;
    }

    /**
     * Get paymentDate
     *
     * @return paymentDate
     */
    @NotNull
    @Valid
    @Schema(name = "paymentDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("paymentDate")
    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public EnrollmentPaymentDTO enrollmentValue(Integer enrollmentValue) {
        this.enrollmentValue = enrollmentValue;
        return this;
    }

    /**
     * Get enrollmentValue
     *
     * @return enrollmentValue
     */

    @Schema(name = "enrollmentValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("enrollmentValue")
    public Integer getEnrollmentValue() {
        return enrollmentValue;
    }

    public void setEnrollmentValue(Integer enrollmentValue) {
        this.enrollmentValue = enrollmentValue;
    }

    public EnrollmentPaymentDTO paidAmount(Integer paidAmount) {
        this.paidAmount = paidAmount;
        return this;
    }

    /**
     * Get paidAmount
     *
     * @return paidAmount
     */
    @NotNull
    @Schema(name = "paidAmount", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("paidAmount")
    public Integer getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(Integer paidAmount) {
        this.paidAmount = paidAmount;
    }

    public EnrollmentPaymentDTO remainedValue(Integer remainedValue) {
        this.remainedValue = remainedValue;
        return this;
    }

    /**
     * Get remainedValue
     *
     * @return remainedValue
     */

    @Schema(name = "remainedValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("remainedValue")
    public Integer getRemainedValue() {
        return remainedValue;
    }

    public void setRemainedValue(Integer remainedValue) {
        this.remainedValue = remainedValue;
    }

    public EnrollmentPaymentDTO paymentMethodId(Integer paymentMethodId) {
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

    public EnrollmentPaymentDTO imageUrl(String imageUrl) {
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

    public EnrollmentPaymentDTO note(String note) {
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

    public EnrollmentPaymentDTO paymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
        return this;
    }

    /**
     * Get paymentStatus
     *
     * @return paymentStatus
     */
    @Valid
    @Schema(name = "paymentStatus", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentStatus")
    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EnrollmentPaymentDTO enrollmentPaymentDTO = (EnrollmentPaymentDTO) o;
        return Objects.equals(this.enrollmentId, enrollmentPaymentDTO.enrollmentId)
                && Objects.equals(this.paymentDate, enrollmentPaymentDTO.paymentDate)
                && Objects.equals(this.enrollmentValue, enrollmentPaymentDTO.enrollmentValue)
                && Objects.equals(this.paidAmount, enrollmentPaymentDTO.paidAmount)
                && Objects.equals(this.remainedValue, enrollmentPaymentDTO.remainedValue)
                && Objects.equals(this.paymentMethodId, enrollmentPaymentDTO.paymentMethodId)
                && Objects.equals(this.imageUrl, enrollmentPaymentDTO.imageUrl)
                && Objects.equals(this.note, enrollmentPaymentDTO.note)
                && Objects.equals(this.paymentStatus, enrollmentPaymentDTO.paymentStatus);
    }

    @Override
    public int hashCode() {
        return Objects.hash(enrollmentId, paymentDate, enrollmentValue, paidAmount, remainedValue, paymentMethodId,
                imageUrl, note, paymentStatus);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentPaymentDTO {\n");
        sb.append("    enrollmentId: ").append(toIndentedString(enrollmentId)).append("\n");
        sb.append("    paymentDate: ").append(toIndentedString(paymentDate)).append("\n");
        sb.append("    enrollmentValue: ").append(toIndentedString(enrollmentValue)).append("\n");
        sb.append("    paidAmount: ").append(toIndentedString(paidAmount)).append("\n");
        sb.append("    remainedValue: ").append(toIndentedString(remainedValue)).append("\n");
        sb.append("    paymentMethodId: ").append(toIndentedString(paymentMethodId)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    paymentStatus: ").append(toIndentedString(paymentStatus)).append("\n");
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
