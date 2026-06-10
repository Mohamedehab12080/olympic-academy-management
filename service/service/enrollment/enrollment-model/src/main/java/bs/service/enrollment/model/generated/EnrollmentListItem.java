package bs.service.enrollment.model.generated;

import bs.lib.common.model.generated.LookupVTO;
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
 * EnrollmentListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EnrollmentListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private LookupVTO trainee;

    private LookupVTO course;

    private LookupVTO trainer;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    private LookupVTO enrollmentStatus;

    private LookupVTO paymentStatus;

    private Integer finalSubscriptionValue;

    private Integer remainedSubscriptionValue;

    private Boolean isActive;

    public EnrollmentListItem id(Integer id) {
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

    public EnrollmentListItem trainee(LookupVTO trainee) {
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

    public EnrollmentListItem course(LookupVTO course) {
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

    public EnrollmentListItem trainer(LookupVTO trainer) {
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

    public EnrollmentListItem startDate(LocalDate startDate) {
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

    public EnrollmentListItem endDate(LocalDate endDate) {
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

    public EnrollmentListItem enrollmentStatus(LookupVTO enrollmentStatus) {
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

    public EnrollmentListItem paymentStatus(LookupVTO paymentStatus) {
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

    public EnrollmentListItem finalSubscriptionValue(Integer finalSubscriptionValue) {
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

    public EnrollmentListItem remainedSubscriptionValue(Integer remainedSubscriptionValue) {
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

    public EnrollmentListItem isActive(Boolean isActive) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        EnrollmentListItem enrollmentListItem = (EnrollmentListItem) o;
        return Objects.equals(this.id, enrollmentListItem.id)
                && Objects.equals(this.trainee, enrollmentListItem.trainee)
                && Objects.equals(this.course, enrollmentListItem.course)
                && Objects.equals(this.trainer, enrollmentListItem.trainer)
                && Objects.equals(this.startDate, enrollmentListItem.startDate)
                && Objects.equals(this.endDate, enrollmentListItem.endDate)
                && Objects.equals(this.enrollmentStatus, enrollmentListItem.enrollmentStatus)
                && Objects.equals(this.paymentStatus, enrollmentListItem.paymentStatus)
                && Objects.equals(this.finalSubscriptionValue, enrollmentListItem.finalSubscriptionValue)
                && Objects.equals(this.remainedSubscriptionValue, enrollmentListItem.remainedSubscriptionValue)
                && Objects.equals(this.isActive, enrollmentListItem.isActive);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, trainee, course, trainer, startDate, endDate, enrollmentStatus, paymentStatus,
                finalSubscriptionValue, remainedSubscriptionValue, isActive);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EnrollmentListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    trainee: ").append(toIndentedString(trainee)).append("\n");
        sb.append("    course: ").append(toIndentedString(course)).append("\n");
        sb.append("    trainer: ").append(toIndentedString(trainer)).append("\n");
        sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
        sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
        sb.append("    enrollmentStatus: ").append(toIndentedString(enrollmentStatus)).append("\n");
        sb.append("    paymentStatus: ").append(toIndentedString(paymentStatus)).append("\n");
        sb.append("    finalSubscriptionValue: ").append(toIndentedString(finalSubscriptionValue)).append("\n");
        sb.append("    remainedSubscriptionValue: ").append(toIndentedString(remainedSubscriptionValue)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
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
