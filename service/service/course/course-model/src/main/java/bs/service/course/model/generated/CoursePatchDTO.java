package bs.service.course.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * CoursePatchDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class CoursePatchDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Valid
    private List<Integer> courseIds = new ArrayList<>();

    private Integer duration;

    private Integer maxCapacity;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate startDate;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate endDate;

    private Integer price;

    private Boolean isActive;

    private Boolean isPublic;

    public CoursePatchDTO courseIds(List<Integer> courseIds) {
        this.courseIds = courseIds;
        return this;
    }

    public CoursePatchDTO addCourseIdsItem(Integer courseIdsItem) {
        if (this.courseIds == null) {
            this.courseIds = new ArrayList<>();
        }
        this.courseIds.add(courseIdsItem);
        return this;
    }

    /**
     * Get courseIds
     *
     * @return courseIds
     */

    @Schema(name = "courseIds", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("courseIds")
    public List<Integer> getCourseIds() {
        return courseIds;
    }

    public void setCourseIds(List<Integer> courseIds) {
        this.courseIds = courseIds;
    }

    public CoursePatchDTO duration(Integer duration) {
        this.duration = duration;
        return this;
    }

    /**
     * Get duration
     *
     * @return duration
     */

    @Schema(name = "duration", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("duration")
    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public CoursePatchDTO maxCapacity(Integer maxCapacity) {
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

    public CoursePatchDTO startDate(LocalDate startDate) {
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

    public CoursePatchDTO endDate(LocalDate endDate) {
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

    public CoursePatchDTO price(Integer price) {
        this.price = price;
        return this;
    }

    /**
     * Get price
     *
     * @return price
     */

    @Schema(name = "price", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("price")
    public Integer getPrice() {
        return price;
    }

    public void setPrice(Integer price) {
        this.price = price;
    }

    public CoursePatchDTO isActive(Boolean isActive) {
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

    public CoursePatchDTO isPublic(Boolean isPublic) {
        this.isPublic = isPublic;
        return this;
    }

    /**
     * Get isPublic
     *
     * @return isPublic
     */

    @Schema(name = "isPublic", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
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
        CoursePatchDTO coursePatchDTO = (CoursePatchDTO) o;
        return Objects.equals(this.courseIds, coursePatchDTO.courseIds)
                && Objects.equals(this.duration, coursePatchDTO.duration)
                && Objects.equals(this.maxCapacity, coursePatchDTO.maxCapacity)
                && Objects.equals(this.startDate, coursePatchDTO.startDate)
                && Objects.equals(this.endDate, coursePatchDTO.endDate)
                && Objects.equals(this.price, coursePatchDTO.price)
                && Objects.equals(this.isActive, coursePatchDTO.isActive)
                && Objects.equals(this.isPublic, coursePatchDTO.isPublic);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseIds, duration, maxCapacity, startDate, endDate, price, isActive, isPublic);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class CoursePatchDTO {\n");
        sb.append("    courseIds: ").append(toIndentedString(courseIds)).append("\n");
        sb.append("    duration: ").append(toIndentedString(duration)).append("\n");
        sb.append("    maxCapacity: ").append(toIndentedString(maxCapacity)).append("\n");
        sb.append("    startDate: ").append(toIndentedString(startDate)).append("\n");
        sb.append("    endDate: ").append(toIndentedString(endDate)).append("\n");
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
