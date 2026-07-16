package bs.service.enrollment.model.generated;

import bs.lib.common.model.enums.PaymentStatus;
import bs.service.enrollment.model.enums.EnrollmentStatus;
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
 * EnrollmentDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer traineeId;

    private Integer courseId;

    private Integer trainerId;

    private Integer enrollmentTypeId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    private EnrollmentStatus enrollmentStatus;

    private PaymentStatus paymentStatus;

    private Integer subscriptionValue;

    private Integer discountAmount;

    private Float discountPercentage;

    private Integer finalSubscriptionValue;

    private Integer remainedSubscriptionValue;

    private Boolean isActive;

    private Boolean isAutoUpdate;

    private String note;

    public EnrollmentDTO traineeId(Integer traineeId) {
        this.traineeId = traineeId;
        return this;
    }

    /**
     * Get traineeId
     *
     * @return traineeId
     */
    @NotNull
    @Schema(name = "traineeId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("traineeId")
    public Integer getTraineeId() {
        return traineeId;
    }

    public void setTraineeId(Integer traineeId) {
        this.traineeId = traineeId;
    }

    public EnrollmentDTO courseId(Integer courseId) {
        this.courseId = courseId;
        return this;
    }

    /**
     * Get courseId
     *
     * @return courseId
     */
    @NotNull
    @Schema(name = "courseId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("courseId")
    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public EnrollmentDTO trainerId(Integer trainerId) {
        this.trainerId = trainerId;
        return this;
    }

    /**
     * Get trainerId
     *
     * @return trainerId
     */
    @NotNull
    @Schema(name = "trainerId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("trainerId")
    public Integer getTrainerId() {
        return trainerId;
    }

    public void setTrainerId(Integer trainerId) {
        this.trainerId = trainerId;
    }

    public EnrollmentDTO enrollmentTypeId(Integer enrollmentTypeId) {
        this.enrollmentTypeId = enrollmentTypeId;
        return this;
    }

    /**
     * Get enrollmentTypeId
     *
     * @return enrollmentTypeId
     */

    @Schema(name = "enrollmentTypeId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("enrollmentTypeId")
    public Integer getEnrollmentTypeId() {
        return enrollmentTypeId;
    }

    public void setEnrollmentTypeId(Integer enrollmentTypeId) {
        this.enrollmentTypeId = enrollmentTypeId;
    }

    public EnrollmentDTO startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    /**
     * Get startDate
     *
     * @return startDate
     */
    @NotNull
    @Valid
    @Schema(name = "startDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("startDate")
    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public EnrollmentDTO endDate(LocalDate endDate) {
        this.endDate = endDate;
        return this;
    }

    /**
     * Get endDate
     *
     * @return endDate
     */
    @Valid
    @Schema(name = "endDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("endDate")
    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public EnrollmentDTO enrollmentStatus(EnrollmentStatus enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
        return this;
    }

    /**
     * Get enrollmentStatus
     *
     * @return enrollmentStatus
     */
    @Valid
    @Schema(name = "enrollmentStatus", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("enrollmentStatus")
    public EnrollmentStatus getEnrollmentStatus() {
        return enrollmentStatus;
    }

    public void setEnrollmentStatus(EnrollmentStatus enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
    }

    public EnrollmentDTO paymentStatus(PaymentStatus paymentStatus) {
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

    public EnrollmentDTO subscriptionValue(Integer subscriptionValue) {
        this.subscriptionValue = subscriptionValue;
        return this;
    }

    /**
     * Get subscriptionValue
     *
     * @return subscriptionValue
     */

    @Schema(name = "subscriptionValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("subscriptionValue")
    public Integer getSubscriptionValue() {
        return subscriptionValue;
    }

    public void setSubscriptionValue(Integer subscriptionValue) {
        this.subscriptionValue = subscriptionValue;
    }

    public EnrollmentDTO discountAmount(Integer discountAmount) {
        this.discountAmount = discountAmount;
        return this;
    }

    /**
     * Get discountAmount
     *
     * @return discountAmount
     */

    @Schema(name = "discountAmount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("discountAmount")
    public Integer getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Integer discountAmount) {
        this.discountAmount = discountAmount;
    }

    public EnrollmentDTO discountPercentage(Float discountPercentage) {
        this.discountPercentage = discountPercentage;
        return this;
    }

    /**
     * Get discountPercentage
     *
     * @return discountPercentage
     */

    @Schema(name = "discountPercentage", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("discountPercentage")
    public Float getDiscountPercentage() {
        return discountPercentage;
    }

    public void setDiscountPercentage(Float discountPercentage) {
        this.discountPercentage = discountPercentage;
    }

    public EnrollmentDTO finalSubscriptionValue(Integer finalSubscriptionValue) {
        this.finalSubscriptionValue = finalSubscriptionValue;
        return this;
    }

    /**
     * Get finalSubscriptionValue
     *
     * @return finalSubscriptionValue
     */

    @Schema(name = "finalSubscriptionValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("finalSubscriptionValue")
    public Integer getFinalSubscriptionValue() {
        return finalSubscriptionValue;
    }

    public void setFinalSubscriptionValue(Integer finalSubscriptionValue) {
        this.finalSubscriptionValue = finalSubscriptionValue;
    }

    public EnrollmentDTO remainedSubscriptionValue(Integer remainedSubscriptionValue) {
        this.remainedSubscriptionValue = remainedSubscriptionValue;
        return this;
    }

    /**
     * Get remainedSubscriptionValue
     *
     * @return remainedSubscriptionValue
     */

    @Schema(name = "remainedSubscriptionValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("remainedSubscriptionValue")
    public Integer getRemainedSubscriptionValue() {
        return remainedSubscriptionValue;
    }

    public void setRemainedSubscriptionValue(Integer remainedSubscriptionValue) {
        this.remainedSubscriptionValue = remainedSubscriptionValue;
    }

    public EnrollmentDTO isActive(Boolean isActive) {
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

    public EnrollmentDTO isAutoUpdate(Boolean isAutoUpdate) {
        this.isAutoUpdate = isAutoUpdate;
        return this;
    }

    /**
     * Get isAutoUpdate
     *
     * @return isAutoUpdate
     */

    @Schema(name = "isAutoUpdate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("isAutoUpdate")
    public Boolean getIsAutoUpdate() {
        return isAutoUpdate;
    }

    public void setIsAutoUpdate(Boolean isAutoUpdate) {
        this.isAutoUpdate = isAutoUpdate;
    }

    public EnrollmentDTO note(String note) {
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
        EnrollmentDTO enrollmentDTO = (EnrollmentDTO) o;
        return Objects.equals(this.traineeId, enrollmentDTO.traineeId)
                && Objects.equals(this.courseId, enrollmentDTO.courseId)
                && Objects.equals(this.trainerId, enrollmentDTO.trainerId)
                && Objects.equals(this.enrollmentTypeId, enrollmentDTO.enrollmentTypeId)
                && Objects.equals(this.startDate, enrollmentDTO.startDate)
                && Objects.equals(this.endDate, enrollmentDTO.endDate)
                && Objects.equals(this.enrollmentStatus, enrollmentDTO.enrollmentStatus)
                && Objects.equals(this.paymentStatus, enrollmentDTO.paymentStatus)
                && Objects.equals(this.subscriptionValue, enrollmentDTO.subscriptionValue)
                && Objects.equals(this.discountAmount, enrollmentDTO.discountAmount)
                && Objects.equals(this.discountPercentage, enrollmentDTO.discountPercentage)
                && Objects.equals(this.finalSubscriptionValue, enrollmentDTO.finalSubscriptionValue)
                && Objects.equals(this.remainedSubscriptionValue, enrollmentDTO.remainedSubscriptionValue)
                && Objects.equals(this.isActive, enrollmentDTO.isActive)
                && Objects.equals(this.isAutoUpdate, enrollmentDTO.isAutoUpdate)
                && Objects.equals(this.note, enrollmentDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(traineeId, courseId, trainerId, enrollmentTypeId, startDate, endDate, enrollmentStatus,
                paymentStatus, subscriptionValue, discountAmount, discountPercentage, finalSubscriptionValue,
                remainedSubscriptionValue, isActive, isAutoUpdate, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentDTO {\n");
        sb.append("    traineeId: ").append(toIndentedString(traineeId)).append("\n");
        sb.append("    courseId: ").append(toIndentedString(courseId)).append("\n");
        sb.append("    trainerId: ").append(toIndentedString(trainerId)).append("\n");
        sb.append("    enrollmentTypeId: ").append(toIndentedString(enrollmentTypeId)).append("\n");
        sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
        sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
        sb.append("    enrollmentStatus: ").append(toIndentedString(enrollmentStatus)).append("\n");
        sb.append("    paymentStatus: ").append(toIndentedString(paymentStatus)).append("\n");
        sb.append("    subscriptionValue: ").append(toIndentedString(subscriptionValue)).append("\n");
        sb.append("    discountAmount: ").append(toIndentedString(discountAmount)).append("\n");
        sb.append("    discountPercentage: ").append(toIndentedString(discountPercentage)).append("\n");
        sb.append("    finalSubscriptionValue: ").append(toIndentedString(finalSubscriptionValue)).append("\n");
        sb.append("    remainedSubscriptionValue: ").append(toIndentedString(remainedSubscriptionValue)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    isAutoUpdate: ").append(toIndentedString(isAutoUpdate)).append("\n");
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
