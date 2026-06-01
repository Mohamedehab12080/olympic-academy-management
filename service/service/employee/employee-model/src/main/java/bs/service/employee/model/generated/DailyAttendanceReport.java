package bs.service.employee.model.generated;

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
 * DailyAttendanceReport
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class DailyAttendanceReport implements Serializable {

    private static final long serialVersionUID = 1L;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate attendanceDate;

    private Integer totalEmployees;

    private Integer present;

    private Integer absent;

    private Integer late;

    private Integer excused;

    private Double attendanceRate;

    @Valid
    private List<@Valid EmployeeAttendanceListItem> details = new ArrayList<>();

    public DailyAttendanceReport attendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
        return this;
    }

    /**
     * Get attendanceDate
     *
     * @return attendanceDate
     */
    @Valid
    @Schema(name = "attendanceDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("attendanceDate")
    public LocalDate getAttendanceDate() {
        return attendanceDate;
    }

    public void setAttendanceDate(LocalDate attendanceDate) {
        this.attendanceDate = attendanceDate;
    }

    public DailyAttendanceReport totalEmployees(Integer totalEmployees) {
        this.totalEmployees = totalEmployees;
        return this;
    }

    /**
     * Get totalEmployees
     *
     * @return totalEmployees
     */

    @Schema(name = "totalEmployees", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalEmployees")
    public Integer getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(Integer totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public DailyAttendanceReport present(Integer present) {
        this.present = present;
        return this;
    }

    /**
     * Get present
     *
     * @return present
     */

    @Schema(name = "present", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("present")
    public Integer getPresent() {
        return present;
    }

    public void setPresent(Integer present) {
        this.present = present;
    }

    public DailyAttendanceReport absent(Integer absent) {
        this.absent = absent;
        return this;
    }

    /**
     * Get absent
     *
     * @return absent
     */

    @Schema(name = "absent", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("absent")
    public Integer getAbsent() {
        return absent;
    }

    public void setAbsent(Integer absent) {
        this.absent = absent;
    }

    public DailyAttendanceReport late(Integer late) {
        this.late = late;
        return this;
    }

    /**
     * Get late
     *
     * @return late
     */

    @Schema(name = "late", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("late")
    public Integer getLate() {
        return late;
    }

    public void setLate(Integer late) {
        this.late = late;
    }

    public DailyAttendanceReport excused(Integer excused) {
        this.excused = excused;
        return this;
    }

    /**
     * Get excused
     *
     * @return excused
     */

    @Schema(name = "excused", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("excused")
    public Integer getExcused() {
        return excused;
    }

    public void setExcused(Integer excused) {
        this.excused = excused;
    }

    public DailyAttendanceReport attendanceRate(Double attendanceRate) {
        this.attendanceRate = attendanceRate;
        return this;
    }

    /**
     * Get attendanceRate
     *
     * @return attendanceRate
     */

    @Schema(name = "attendanceRate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("attendanceRate")
    public Double getAttendanceRate() {
        return attendanceRate;
    }

    public void setAttendanceRate(Double attendanceRate) {
        this.attendanceRate = attendanceRate;
    }

    public DailyAttendanceReport details(List<@Valid EmployeeAttendanceListItem> details) {
        this.details = details;
        return this;
    }

    public DailyAttendanceReport addDetailsItem(EmployeeAttendanceListItem detailsItem) {
        if (this.details == null) {
            this.details = new ArrayList<>();
        }
        this.details.add(detailsItem);
        return this;
    }

    /**
     * Get details
     *
     * @return details
     */
    @Valid
    @Schema(name = "details", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("details")
    public List<@Valid EmployeeAttendanceListItem> getDetails() {
        return details;
    }

    public void setDetails(List<@Valid EmployeeAttendanceListItem> details) {
        this.details = details;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        DailyAttendanceReport dailyAttendanceReport = (DailyAttendanceReport) o;
        return Objects.equals(this.attendanceDate, dailyAttendanceReport.attendanceDate)
                && Objects.equals(this.totalEmployees, dailyAttendanceReport.totalEmployees)
                && Objects.equals(this.present, dailyAttendanceReport.present)
                && Objects.equals(this.absent, dailyAttendanceReport.absent)
                && Objects.equals(this.late, dailyAttendanceReport.late)
                && Objects.equals(this.excused, dailyAttendanceReport.excused)
                && Objects.equals(this.attendanceRate, dailyAttendanceReport.attendanceRate)
                && Objects.equals(this.details, dailyAttendanceReport.details);
    }

    @Override
    public int hashCode() {
        return Objects.hash(attendanceDate, totalEmployees, present, absent, late, excused, attendanceRate, details);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class DailyAttendanceReport {\n");
        sb.append("    attendanceDate: ").append(toIndentedString(attendanceDate)).append("\n");
        sb.append("    totalEmployees: ").append(toIndentedString(totalEmployees)).append("\n");
        sb.append("    present: ").append(toIndentedString(present)).append("\n");
        sb.append("    absent: ").append(toIndentedString(absent)).append("\n");
        sb.append("    late: ").append(toIndentedString(late)).append("\n");
        sb.append("    excused: ").append(toIndentedString(excused)).append("\n");
        sb.append("    attendanceRate: ").append(toIndentedString(attendanceRate)).append("\n");
        sb.append("    details: ").append(toIndentedString(details)).append("\n");
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
