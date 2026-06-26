package bs.service.financial.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.enrollment.model.generated.EnrollmentVTO;
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
 * EnrollmentPaymentVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentPaymentVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private EnrollmentVTO enrollment;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate paymentDate;

    private Integer enrollmentValue;

    private Integer paidAmount;

    private Integer remainedValue;

    private LookupVTO paymentMethod;

    private String imageUrl;

    private String note;

    private LookupVTO paymentStatus;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public EnrollmentPaymentVTO id(Integer id) {
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

    public EnrollmentPaymentVTO enrollment(EnrollmentVTO enrollment) {
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

    public EnrollmentPaymentVTO paymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
        return this;
    }

    /**
     * Get paymentDate
     *
     * @return paymentDate
     */
    @Valid
    @Schema(name = "paymentDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentDate")
    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public EnrollmentPaymentVTO enrollmentValue(Integer enrollmentValue) {
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

    public EnrollmentPaymentVTO paidAmount(Integer paidAmount) {
        this.paidAmount = paidAmount;
        return this;
    }

    /**
     * Get paidAmount
     *
     * @return paidAmount
     */

    @Schema(name = "paidAmount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paidAmount")
    public Integer getPaidAmount() {
        return paidAmount;
    }

    public void setPaidAmount(Integer paidAmount) {
        this.paidAmount = paidAmount;
    }

    public EnrollmentPaymentVTO remainedValue(Integer remainedValue) {
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

    public EnrollmentPaymentVTO paymentMethod(LookupVTO paymentMethod) {
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

    public EnrollmentPaymentVTO imageUrl(String imageUrl) {
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

    public EnrollmentPaymentVTO note(String note) {
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

    public EnrollmentPaymentVTO paymentStatus(LookupVTO paymentStatus) {
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
    public LookupVTO getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(LookupVTO paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public EnrollmentPaymentVTO createdOn(LocalDateTime createdOn) {
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

    public EnrollmentPaymentVTO createdBy(LightUserVTO createdBy) {
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

    public EnrollmentPaymentVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public EnrollmentPaymentVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        EnrollmentPaymentVTO enrollmentPaymentVTO = (EnrollmentPaymentVTO) o;
        return Objects.equals(this.id, enrollmentPaymentVTO.id)
                && Objects.equals(this.enrollment, enrollmentPaymentVTO.enrollment)
                && Objects.equals(this.paymentDate, enrollmentPaymentVTO.paymentDate)
                && Objects.equals(this.enrollmentValue, enrollmentPaymentVTO.enrollmentValue)
                && Objects.equals(this.paidAmount, enrollmentPaymentVTO.paidAmount)
                && Objects.equals(this.remainedValue, enrollmentPaymentVTO.remainedValue)
                && Objects.equals(this.paymentMethod, enrollmentPaymentVTO.paymentMethod)
                && Objects.equals(this.imageUrl, enrollmentPaymentVTO.imageUrl)
                && Objects.equals(this.note, enrollmentPaymentVTO.note)
                && Objects.equals(this.paymentStatus, enrollmentPaymentVTO.paymentStatus)
                && Objects.equals(this.createdOn, enrollmentPaymentVTO.createdOn)
                && Objects.equals(this.createdBy, enrollmentPaymentVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, enrollmentPaymentVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, enrollmentPaymentVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, enrollment, paymentDate, enrollmentValue, paidAmount, remainedValue, paymentMethod,
                imageUrl, note, paymentStatus, createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentPaymentVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    enrollment: ").append(toIndentedString(enrollment)).append("\n");
        sb.append("    paymentDate: ").append(toIndentedString(paymentDate)).append("\n");
        sb.append("    enrollmentValue: ").append(toIndentedString(enrollmentValue)).append("\n");
        sb.append("    paidAmount: ").append(toIndentedString(paidAmount)).append("\n");
        sb.append("    remainedValue: ").append(toIndentedString(remainedValue)).append("\n");
        sb.append("    paymentMethod: ").append(toIndentedString(paymentMethod)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    paymentStatus: ").append(toIndentedString(paymentStatus)).append("\n");
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
