package bs.service.trainee.model.generated;

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
 * TraineeCertificateVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeCertificateVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String certificateNumber;

    private String certificateName;

    private LookupVTO course;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate issueDate;

    private String grade;

    public TraineeCertificateVTO id(Integer id) {
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

    public TraineeCertificateVTO certificateNumber(String certificateNumber) {
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

    public TraineeCertificateVTO certificateName(String certificateName) {
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

    public TraineeCertificateVTO course(LookupVTO course) {
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

    public TraineeCertificateVTO issueDate(LocalDate issueDate) {
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

    public TraineeCertificateVTO grade(String grade) {
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
        TraineeCertificateVTO traineeCertificateVTO = (TraineeCertificateVTO) o;
        return Objects.equals(this.id, traineeCertificateVTO.id)
                && Objects.equals(this.certificateNumber, traineeCertificateVTO.certificateNumber)
                && Objects.equals(this.certificateName, traineeCertificateVTO.certificateName)
                && Objects.equals(this.course, traineeCertificateVTO.course)
                && Objects.equals(this.issueDate, traineeCertificateVTO.issueDate)
                && Objects.equals(this.grade, traineeCertificateVTO.grade);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, certificateNumber, certificateName, course, issueDate, grade);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeCertificateVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    certificateNumber: ").append(toIndentedString(certificateNumber)).append("\n");
        sb.append("    certificateName: ").append(toIndentedString(certificateName)).append("\n");
        sb.append("    course: ").append(toIndentedString(course)).append("\n");
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
