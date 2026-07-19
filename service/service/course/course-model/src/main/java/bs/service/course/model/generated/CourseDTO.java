package bs.service.course.model.generated;

import bs.service.course.model.enums.CourseTypes;
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
 * CourseDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class CourseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private String description;

    private Integer departmentId;

    private Integer duration;

    private Integer maxCapacity;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    private String imageUrl;

    private CourseTypes courseType;

    private Integer price;

    private Boolean isActive;

    private Boolean isPublic;

    public CourseDTO title(String title) {
        this.title = title;
        return this;
    }

    /**
     * Get title
     *
     * @return title
     */
    @NotNull
    @Schema(name = "title", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public CourseDTO description(String description) {
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

    public CourseDTO departmentId(Integer departmentId) {
        this.departmentId = departmentId;
        return this;
    }

    /**
     * Get departmentId
     *
     * @return departmentId
     */
    @NotNull
    @Schema(name = "departmentId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("departmentId")
    public Integer getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(Integer departmentId) {
        this.departmentId = departmentId;
    }

    public CourseDTO duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    /**
     * Get duration
     *
     * @return duration
     */
    @NotNull
    @Schema(name = "duration", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("duration")
    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public CourseDTO maxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
        return this;
    }

    /**
     * Get maxCapacity minimum: 1
     *
     * @return maxCapacity
     */
    @Min(1)
    @Schema(name = "maxCapacity", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("maxCapacity")
    public Integer getMaxCapacity() {
        return maxCapacity;
    }

    public void setMaxCapacity(Integer maxCapacity) {
        this.maxCapacity = maxCapacity;
    }

    public CourseDTO startDate(LocalDate startDate) {
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

    public CourseDTO endDate(LocalDate endDate) {
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

    public CourseDTO imageUrl(String imageUrl) {
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

    public CourseDTO courseType(CourseTypes courseType) {
        this.courseType = courseType;
        return this;
    }

    /**
     * Get courseType
     *
     * @return courseType
     */
    @NotNull
    @Valid
    @Schema(name = "courseType", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("courseType")
    public CourseTypes getCourseType() {
        return courseType;
    }

    public void setCourseType(CourseTypes courseType) {
        this.courseType = courseType;
    }

    public CourseDTO price(Integer price) {
        this.price = price;
        return this;
    }

    /**
     * Get price
     *
     * @return price
     */
    @NotNull
    @Schema(name = "price", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("price")
    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public CourseDTO isActive(Boolean isActive) {
        this.isActive = isActive;
        return this;
    }

    /**
     * Get isActive
     *
     * @return isActive
     */
    @NotNull
    @Schema(name = "isActive", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("isActive")
    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public CourseDTO isPublic(Boolean isPublic) {
        this.isPublic = isPublic;
        return this;
    }

    /**
     * Get isPublic
     *
     * @return isPublic
     */
    @NotNull
    @Schema(name = "isPublic", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("isPublic")
    public Boolean getIsPublic() {
        return isPublic;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        CourseDTO courseDTO = (CourseDTO) o;
        return Objects.equals(this.title, courseDTO.title) && Objects.equals(this.description, courseDTO.description)
                && Objects.equals(this.departmentId, courseDTO.departmentId)
                && Objects.equals(this.duration, courseDTO.duration)
                && Objects.equals(this.maxCapacity, courseDTO.maxCapacity)
                && Objects.equals(this.startDate, courseDTO.startDate)
                && Objects.equals(this.endDate, courseDTO.endDate) && Objects.equals(this.imageUrl, courseDTO.imageUrl)
                && Objects.equals(this.courseType, courseDTO.courseType) && Objects.equals(this.price, courseDTO.price)
                && Objects.equals(this.isActive, courseDTO.isActive)
                && Objects.equals(this.isPublic, courseDTO.isPublic);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, description, departmentId, duration, maxCapacity, startDate, endDate, imageUrl,
                courseType, price, isActive, isPublic);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class CourseDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    description: ").append(toIndentedString(description)).append("\n");
        sb.append("    departmentId: ").append(toIndentedString(departmentId)).append("\n");
        sb.append("    duration: ").append(toIndentedString(duration)).append("\n");
        sb.append("    maxCapacity: ").append(toIndentedString(maxCapacity)).append("\n");
        sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
        sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
        sb.append("    imageUrl: ").append(toIndentedString(imageUrl)).append("\n");
        sb.append("    courseType: ").append(toIndentedString(courseType)).append("\n");
        sb.append("    price: ").append(toIndentedString(price)).append("\n");
        sb.append("    isActive: ").append(toIndentedString(isActive)).append("\n");
        sb.append("    isPublic: ").append(toIndentedString(isPublic)).append("\n");
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
