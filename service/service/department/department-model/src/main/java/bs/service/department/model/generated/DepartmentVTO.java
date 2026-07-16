package bs.service.department.model.generated;

import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * DepartmentVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class DepartmentVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String title;

    private String description;

    private Boolean isActive;

    private Integer totalCourses;

    private Integer totalGained;

    private Integer totalEnrollmentPayments;

    private Integer totalStudents;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public DepartmentVTO id(Integer id) {
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

    public DepartmentVTO title(String title) {
        this.title = title;
        return this;
    }

    /**
     * Get title
     *
     * @return title
     */

    @Schema(name = "title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public DepartmentVTO description(String description) {
        this.description = description;
        return this;
    }

    /**
     * Get description
     *
     * @return description
     */

    @Schema(name = "description", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("description")
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DepartmentVTO isActive(Boolean isActive) {
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

    public DepartmentVTO totalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
        return this;
    }

    /**
     * Get totalCourses
     *
     * @return totalCourses
     */

    @Schema(name = "totalCourses", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalCourses")
    public Integer getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(Integer totalCourses) {
        this.totalCourses = totalCourses;
    }

    public DepartmentVTO totalGained(Integer totalGained) {
        this.totalGained = totalGained;
        return this;
    }

    /**
     * Get totalGained
     *
     * @return totalGained
     */

    @Schema(name = "totalGained", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalGained")
    public Integer getTotalGained() {
        return totalGained;
    }

    public void setTotalGained(Integer totalGained) {
        this.totalGained = totalGained;
    }

    public DepartmentVTO totalEnrollmentPayments(Integer totalEnrollmentPayments) {
        this.totalEnrollmentPayments = totalEnrollmentPayments;
        return this;
    }

    /**
     * Get totalEnrollmentPayments
     *
     * @return totalEnrollmentPayments
     */

    @Schema(name = "totalEnrollmentPayments", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalEnrollmentPayments")
    public Integer getTotalEnrollmentPayments() {
        return totalEnrollmentPayments;
    }

    public void setTotalEnrollmentPayments(Integer totalEnrollmentPayments) {
        this.totalEnrollmentPayments = totalEnrollmentPayments;
    }

    public DepartmentVTO totalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
        return this;
    }

    /**
     * Get totalStudents
     *
     * @return totalStudents
     */

    @Schema(name = "totalStudents", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalStudents")
    public Integer getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(Integer totalStudents) {
        this.totalStudents = totalStudents;
    }

    public DepartmentVTO createdOn(LocalDateTime createdOn) {
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

    public DepartmentVTO createdBy(LightUserVTO createdBy) {
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

    public DepartmentVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public DepartmentVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        DepartmentVTO departmentVTO = (DepartmentVTO) o;
        return Objects.equals(this.id, departmentVTO.id) && Objects.equals(this.title, departmentVTO.title)
                && Objects.equals(this.description, departmentVTO.description)
                && Objects.equals(this.isActive, departmentVTO.isActive)
                && Objects.equals(this.totalCourses, departmentVTO.totalCourses)
                && Objects.equals(this.totalGained, departmentVTO.totalGained)
                && Objects.equals(this.totalEnrollmentPayments, departmentVTO.totalEnrollmentPayments)
                && Objects.equals(this.totalStudents, departmentVTO.totalStudents)
                && Objects.equals(this.createdOn, departmentVTO.createdOn)
                && Objects.equals(this.createdBy, departmentVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, departmentVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, departmentVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, description, isActive, totalCourses, totalGained, totalEnrollmentPayments,
                totalStudents, createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class DepartmentVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    description: ").append(toIndentedString(description)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    totalCourses: ").append(toIndentedString(totalCourses)).append("\n");
        sb.append("    totalGained: ").append(toIndentedString(totalGained)).append("\n");
        sb.append("    totalEnrollmentPayments: ").append(toIndentedString(totalEnrollmentPayments)).append("\n");
        sb.append("    totalStudents: ").append(toIndentedString(totalStudents)).append("\n");
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
