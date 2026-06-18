package bs.service.financial.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.enrollment.model.generated.EnrollmentVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Objects;

import org.springframework.format.annotation.DateTimeFormat;

/**
 * EnrollmentRefundVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentRefundVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private EnrollmentVTO enrollment;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate refundDate;

    private Integer amountRefunded;

    private LookupVTO paymentMethod;

    private String imageUrl;

    private String note;

    private LookupVTO refundStatus;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public EnrollmentRefundVTO id(Integer id) {
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

    public EnrollmentRefundVTO enrollment(EnrollmentVTO enrollment) {
        this.enrollment = enrollment;
        return this;
    }

    /**
     * Get enrollment
     *
     * @return enrollment
     */
    @Valid
    @Schema(name = "enrollment", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("enrollment")
    public EnrollmentVTO getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(EnrollmentVTO enrollment) {
        this.enrollment = enrollment;
    }

    public EnrollmentRefundVTO refundDate(LocalDate refundDate) {
        this.refundDate = refundDate;
        return this;
    }

    /**
     * Get refundDate
     *
     * @return refundDate
     */
    @Valid
    @Schema(name = "refundDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("refundDate")
    public LocalDate getRefundDate() {
        return refundDate;
    }

    public void setRefundDate(LocalDate refundDate) {
        this.refundDate = refundDate;
    }

    public EnrollmentRefundVTO amountRefunded(Integer amountRefunded) {
        this.amountRefunded = amountRefunded;
        return this;
    }

    /**
     * Get amountRefunded
     *
     * @return amountRefunded
     */

    @Schema(name = "amountRefunded", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("amountRefunded")
    public Integer getAmountRefunded() {
        return amountRefunded;
    }

    public void setAmountRefunded(Integer amountRefunded) {
        this.amountRefunded = amountRefunded;
    }

    public EnrollmentRefundVTO paymentMethod(LookupVTO paymentMethod) {
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

    public EnrollmentRefundVTO imageUrl(String imageUrl) {
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

    public EnrollmentRefundVTO note(String note) {
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

    public EnrollmentRefundVTO refundStatus(LookupVTO refundStatus) {
        this.refundStatus = refundStatus;
        return this;
    }

    /**
     * Get refundStatus
     *
     * @return refundStatus
     */
    @Valid
    @Schema(name = "refundStatus", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("refundStatus")
    public LookupVTO getRefundStatus() {
        return refundStatus;
    }

    public void setRefundStatus(LookupVTO refundStatus) {
        this.refundStatus = refundStatus;
    }

    public EnrollmentRefundVTO createdOn(LocalDateTime createdOn) {
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

    public EnrollmentRefundVTO createdBy(LightUserVTO createdBy) {
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

    public EnrollmentRefundVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public EnrollmentRefundVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        EnrollmentRefundVTO enrollmentRefundVTO = (EnrollmentRefundVTO) o;
        return Objects.equals(this.id, enrollmentRefundVTO.id)
                && Objects.equals(this.enrollment, enrollmentRefundVTO.enrollment)
                && Objects.equals(this.refundDate, enrollmentRefundVTO.refundDate)
                && Objects.equals(this.amountRefunded, enrollmentRefundVTO.amountRefunded)
                && Objects.equals(this.paymentMethod, enrollmentRefundVTO.paymentMethod)
                && Objects.equals(this.imageUrl, enrollmentRefundVTO.imageUrl)
                && Objects.equals(this.note, enrollmentRefundVTO.note)
                && Objects.equals(this.refundStatus, enrollmentRefundVTO.refundStatus)
                && Objects.equals(this.createdOn, enrollmentRefundVTO.createdOn)
                && Objects.equals(this.createdBy, enrollmentRefundVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, enrollmentRefundVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, enrollmentRefundVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, enrollment, refundDate, amountRefunded, paymentMethod, imageUrl, note, refundStatus,
                createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentRefundVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    enrollment: ").append(toIndentedString(enrollment)).append("\n");
        sb.append("    refundDate: ").append(toIndentedString(refundDate)).append("\n");
        sb.append("    amountRefunded: ").append(toIndentedString(amountRefunded)).append("\n");
        sb.append("    paymentMethod: ").append(toIndentedString(paymentMethod)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    refundStatus: ").append(toIndentedString(refundStatus)).append("\n");
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
