package bs.service.enrollment.model.generated;

import bs.lib.common.model.generated.LookupVTO;
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
 * EnrollmentVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LookupVTO trainee;

    private LookupVTO course;

    private LookupVTO trainer;

    private LookupVTO enrollmentType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    private LookupVTO enrollmentStatus;

    private LookupVTO paymentStatus;

    private Integer subscriptionValue;

    private Integer discountAmount;

    private Float discountPercentage;

    private Integer finalSubscriptionValue;

    private Integer remainedSubscriptionValue;

    private String note;

    private Boolean isActive;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public EnrollmentVTO id(Integer id) {
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

    public EnrollmentVTO trainee(LookupVTO trainee) {
        this.trainee = trainee;
        return this;
    }

    /**
     * Get trainee
     *
     * @return trainee
     */
    @Valid
    @Schema(name = "trainee", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("trainee")
    public LookupVTO getTrainee() {
        return trainee;
    }

    public void setTrainee(LookupVTO trainee) {
        this.trainee = trainee;
    }

    public EnrollmentVTO course(LookupVTO course) {
        this.course = course;
        return this;
    }

    /**
     * Get course
     *
     * @return course
     */
    @Valid
    @Schema(name = "course", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("course")
    public LookupVTO getCourse() {
        return course;
    }

    public void setCourse(LookupVTO course) {
        this.course = course;
    }

    public EnrollmentVTO trainer(LookupVTO trainer) {
        this.trainer = trainer;
        return this;
    }

    /**
     * Get trainer
     *
     * @return trainer
     */
    @Valid
    @Schema(name = "trainer", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("trainer")
    public LookupVTO getTrainer() {
        return trainer;
    }

    public void setTrainer(LookupVTO trainer) {
        this.trainer = trainer;
    }

    public EnrollmentVTO enrollmentType(LookupVTO enrollmentType) {
        this.enrollmentType = enrollmentType;
        return this;
    }

    /**
     * Get enrollmentType
     *
     * @return enrollmentType
     */
    @Valid
    @Schema(name = "enrollmentType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("enrollmentType")
    public LookupVTO getEnrollmentType() {
        return enrollmentType;
    }

    public void setEnrollmentType(LookupVTO enrollmentType) {
        this.enrollmentType = enrollmentType;
    }

    public EnrollmentVTO startDate(LocalDate startDate) {
        this.startDate = startDate;
        return this;
    }

    /**
     * Get startDate
     *
     * @return startDate
     */
    @Valid
    @Schema(name = "startDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("startDate")
    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public EnrollmentVTO endDate(LocalDate endDate) {
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

    public EnrollmentVTO enrollmentStatus(LookupVTO enrollmentStatus) {
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
    public LookupVTO getEnrollmentStatus() {
        return enrollmentStatus;
    }

    public void setEnrollmentStatus(LookupVTO enrollmentStatus) {
        this.enrollmentStatus = enrollmentStatus;
    }

    public EnrollmentVTO paymentStatus(LookupVTO paymentStatus) {
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

    public EnrollmentVTO subscriptionValue(Integer subscriptionValue) {
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

    public EnrollmentVTO discountAmount(Integer discountAmount) {
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

    public EnrollmentVTO discountPercentage(Float discountPercentage) {
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

    public EnrollmentVTO finalSubscriptionValue(Integer finalSubscriptionValue) {
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

    public EnrollmentVTO remainedSubscriptionValue(Integer remainedSubscriptionValue) {
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

    public EnrollmentVTO note(String note) {
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

    public EnrollmentVTO isActive(Boolean isActive) {
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

    public EnrollmentVTO createdOn(LocalDateTime createdOn) {
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

    public EnrollmentVTO createdBy(LightUserVTO createdBy) {
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

    public EnrollmentVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public EnrollmentVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        EnrollmentVTO enrollmentVTO = (EnrollmentVTO) o;
        return Objects.equals(this.id, enrollmentVTO.id) && Objects.equals(this.trainee, enrollmentVTO.trainee)
                && Objects.equals(this.course, enrollmentVTO.course)
                && Objects.equals(this.trainer, enrollmentVTO.trainer)
                && Objects.equals(this.enrollmentType, enrollmentVTO.enrollmentType)
                && Objects.equals(this.startDate, enrollmentVTO.startDate)
                && Objects.equals(this.endDate, enrollmentVTO.endDate)
                && Objects.equals(this.enrollmentStatus, enrollmentVTO.enrollmentStatus)
                && Objects.equals(this.paymentStatus, enrollmentVTO.paymentStatus)
                && Objects.equals(this.subscriptionValue, enrollmentVTO.subscriptionValue)
                && Objects.equals(this.discountAmount, enrollmentVTO.discountAmount)
                && Objects.equals(this.discountPercentage, enrollmentVTO.discountPercentage)
                && Objects.equals(this.finalSubscriptionValue, enrollmentVTO.finalSubscriptionValue)
                && Objects.equals(this.remainedSubscriptionValue, enrollmentVTO.remainedSubscriptionValue)
                && Objects.equals(this.note, enrollmentVTO.note)
                && Objects.equals(this.isActive, enrollmentVTO.isActive)
                && Objects.equals(this.createdOn, enrollmentVTO.createdOn)
                && Objects.equals(this.createdBy, enrollmentVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, enrollmentVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, enrollmentVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainee, course, trainer, enrollmentType, startDate, endDate, enrollmentStatus,
                paymentStatus, subscriptionValue, discountAmount, discountPercentage, finalSubscriptionValue,
                remainedSubscriptionValue, note, isActive, createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    trainee: ").append(toIndentedString(trainee)).append("\n");
        sb.append("    course: ").append(toIndentedString(course)).append("\n");
        sb.append("    trainer: ").append(toIndentedString(trainer)).append("\n");
        sb.append("    enrollmentType: ").append(toIndentedString(enrollmentType)).append("\n");
        sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
        sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
        sb.append("    enrollmentStatus: ").append(toIndentedString(enrollmentStatus)).append("\n");
        sb.append("    paymentStatus: ").append(toIndentedString(paymentStatus)).append("\n");
        sb.append("    subscriptionValue: ").append(toIndentedString(subscriptionValue)).append("\n");
        sb.append("    discountAmount: ").append(toIndentedString(discountAmount)).append("\n");
        sb.append("    discountPercentage: ").append(toIndentedString(discountPercentage)).append("\n");
        sb.append("    finalSubscriptionValue: ").append(toIndentedString(finalSubscriptionValue)).append("\n");
        sb.append("    remainedSubscriptionValue: ").append(toIndentedString(remainedSubscriptionValue)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
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
