package bs.service.financial.model.generated;

import bs.service.financial.model.enums.RefundStatus;
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
 * EnrollmentRefundDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentRefundDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer enrollmentId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate refundDate;

    private Integer amountRefunded;

    private Integer paymentMethodId;

    private String imageUrl;

    private String note;

    private RefundStatus status;

    public EnrollmentRefundDTO enrollmentId(Integer enrollmentId) {
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

    public EnrollmentRefundDTO refundDate(LocalDate refundDate) {
        this.refundDate = refundDate;
        return this;
    }

    /**
     * Get refundDate
     *
     * @return refundDate
     */
    @NotNull
    @Valid
    @Schema(name = "refundDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("refundDate")
    public LocalDate getRefundDate() {
        return refundDate;
    }

    public void setRefundDate(LocalDate refundDate) {
        this.refundDate = refundDate;
    }

    public EnrollmentRefundDTO amountRefunded(Integer amountRefunded) {
        this.amountRefunded = amountRefunded;
        return this;
    }

    /**
     * Get amountRefunded
     *
     * @return amountRefunded
     */
    @NotNull
    @Schema(name = "amountRefunded", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("amountRefunded")
    public Integer getAmountRefunded() {
        return amountRefunded;
    }

    public void setAmountRefunded(Integer amountRefunded) {
        this.amountRefunded = amountRefunded;
    }

    public EnrollmentRefundDTO paymentMethodId(Integer paymentMethodId) {
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

    public EnrollmentRefundDTO imageUrl(String imageUrl) {
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

    public EnrollmentRefundDTO note(String note) {
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

    public EnrollmentRefundDTO status(RefundStatus status) {
        this.status = status;
        return this;
    }

    /**
     * Get status
     *
     * @return status
     */
    @Valid
    @Schema(name = "status", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("status")
    public RefundStatus getStatus() {
        return status;
    }

    public void setStatus(RefundStatus status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EnrollmentRefundDTO enrollmentRefundDTO = (EnrollmentRefundDTO) o;
        return Objects.equals(this.enrollmentId, enrollmentRefundDTO.enrollmentId)
                && Objects.equals(this.refundDate, enrollmentRefundDTO.refundDate)
                && Objects.equals(this.amountRefunded, enrollmentRefundDTO.amountRefunded)
                && Objects.equals(this.paymentMethodId, enrollmentRefundDTO.paymentMethodId)
                && Objects.equals(this.imageUrl, enrollmentRefundDTO.imageUrl)
                && Objects.equals(this.note, enrollmentRefundDTO.note)
                && Objects.equals(this.status, enrollmentRefundDTO.status);
    }

    @Override
    public int hashCode() {
        return Objects.hash(enrollmentId, refundDate, amountRefunded, paymentMethodId, imageUrl, note, status);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentRefundDTO {\n");
        sb.append("    enrollmentId: ").append(toIndentedString(enrollmentId)).append("\n");
        sb.append("    refundDate: ").append(toIndentedString(refundDate)).append("\n");
        sb.append("    amountRefunded: ").append(toIndentedString(amountRefunded)).append("\n");
        sb.append("    paymentMethodId: ").append(toIndentedString(paymentMethodId)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    status: ").append(toIndentedString(status)).append("\n");
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
