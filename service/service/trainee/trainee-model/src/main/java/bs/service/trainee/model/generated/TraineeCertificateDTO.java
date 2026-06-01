package bs.service.trainee.model.generated;

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
 * TraineeCertificateDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeCertificateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String certificateNumber;

    private String certificateName;

    private Integer courseId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate issueDate;

    private String grade;

    public TraineeCertificateDTO certificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
        return this;
    }

    /**
     * Get certificateNumber
     *
     * @return certificateNumber
     */

    @Schema(name = "certificateNumber", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("certificateNumber")
    public String getCertificateNumber() {
        return certificateNumber;
    }

    public void setCertificateNumber(String certificateNumber) {
        this.certificateNumber = certificateNumber;
    }

    public TraineeCertificateDTO certificateName(String certificateName) {
        this.certificateName = certificateName;
        return this;
    }

    /**
     * Get certificateName
     *
     * @return certificateName
     */

    @Schema(name = "certificateName", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("certificateName")
    public String getCertificateName() {
        return certificateName;
    }

    public void setCertificateName(String certificateName) {
        this.certificateName = certificateName;
    }

    public TraineeCertificateDTO courseId(Integer courseId) {
        this.courseId = courseId;
        return this;
    }

    /**
     * Get courseId
     *
     * @return courseId
     */

    @Schema(name = "courseId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("courseId")
    public Integer getCourseId() {
        return courseId;
    }

    public void setCourseId(Integer courseId) {
        this.courseId = courseId;
    }

    public TraineeCertificateDTO issueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
        return this;
    }

    /**
     * Get issueDate
     *
     * @return issueDate
     */
    @Valid
    @Schema(name = "issueDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("issueDate")
    public LocalDate getIssueDate() {
        return issueDate;
    }

    public void setIssueDate(LocalDate issueDate) {
        this.issueDate = issueDate;
    }

    public TraineeCertificateDTO grade(String grade) {
        this.grade = grade;
        return this;
    }

    /**
     * Get grade
     *
     * @return grade
     */

    @Schema(name = "grade", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("grade")
    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeCertificateDTO traineeCertificateDTO = (TraineeCertificateDTO) o;
        return Objects.equals(this.certificateNumber, traineeCertificateDTO.certificateNumber)
                && Objects.equals(this.certificateName, traineeCertificateDTO.certificateName)
                && Objects.equals(this.courseId, traineeCertificateDTO.courseId)
                && Objects.equals(this.issueDate, traineeCertificateDTO.issueDate)
                && Objects.equals(this.grade, traineeCertificateDTO.grade);
    }

    @Override
    public int hashCode() {
        return Objects.hash(certificateNumber, certificateName, courseId, issueDate, grade);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeCertificateDTO {\n");
        sb.append("    certificateNumber: ").append(toIndentedString(certificateNumber)).append("\n");
        sb.append("    certificateName: ").append(toIndentedString(certificateName)).append("\n");
        sb.append("    courseId: ").append(toIndentedString(courseId)).append("\n");
        sb.append("    issueDate: ").append(toIndentedString(issueDate)).append("\n");
        sb.append("    grade: ").append(toIndentedString(grade)).append("\n");
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
