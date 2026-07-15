package bs.service.financial.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * FinancialTotalVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class FinancialTotalVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer totalSalary;

    private Integer totalAdvance;

    private Integer totalIncentives;

    private Integer totalPlacesGained;

    private Integer totalPlacesRent;

    private Integer totalEnrollmentPayments;

    private Integer totalEnrollmentRefunds;

    private Integer totalExpenses;

    private Integer activeEnrollmentsCount;

    private Integer activeCoursesCount;

    private Integer activeTraineesCount;

    private Integer activeEmployeesCount;

    private Integer inactiveEnrollmentsCount;

    private Integer inactiveCoursesCount;

    private Integer inactiveTraineesCount;

    private Integer inactiveEmployeesCount;

    public FinancialTotalVTO totalSalary(Integer totalSalary) {
        this.totalSalary = totalSalary;
        return this;
    }

    /**
     * Get totalSalary
     *
     * @return totalSalary
     */

    @Schema(name = "totalSalary", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalSalary")
    public Integer getTotalSalary() {
        return totalSalary;
    }

    public void setTotalSalary(Integer totalSalary) {
        this.totalSalary = totalSalary;
    }

    public FinancialTotalVTO totalAdvance(Integer totalAdvance) {
        this.totalAdvance = totalAdvance;
        return this;
    }

    /**
     * Get totalAdvance
     *
     * @return totalAdvance
     */

    @Schema(name = "totalAdvance", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalAdvance")
    public Integer getTotalAdvance() {
        return totalAdvance;
    }

    public void setTotalAdvance(Integer totalAdvance) {
        this.totalAdvance = totalAdvance;
    }

    public FinancialTotalVTO totalIncentives(Integer totalIncentives) {
        this.totalIncentives = totalIncentives;
        return this;
    }

    /**
     * Get totalIncentives
     *
     * @return totalIncentives
     */

    @Schema(name = "totalIncentives", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalIncentives")
    public Integer getTotalIncentives() {
        return totalIncentives;
    }

    public void setTotalIncentives(Integer totalIncentives) {
        this.totalIncentives = totalIncentives;
    }

    public FinancialTotalVTO totalPlacesGained(Integer totalPlacesGained) {
        this.totalPlacesGained = totalPlacesGained;
        return this;
    }

    /**
     * Get totalPlacesGained
     *
     * @return totalPlacesGained
     */

    @Schema(name = "totalPlacesGained", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalPlacesGained")
    public Integer getTotalPlacesGained() {
        return totalPlacesGained;
    }

    public void setTotalPlacesGained(Integer totalPlacesGained) {
        this.totalPlacesGained = totalPlacesGained;
    }

    public FinancialTotalVTO totalPlacesRent(Integer totalPlacesRent) {
        this.totalPlacesRent = totalPlacesRent;
        return this;
    }

    /**
     * Get totalPlacesRent
     *
     * @return totalPlacesRent
     */

    @Schema(name = "totalPlacesRent", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalPlacesRent")
    public Integer getTotalPlacesRent() {
        return totalPlacesRent;
    }

    public void setTotalPlacesRent(Integer totalPlacesRent) {
        this.totalPlacesRent = totalPlacesRent;
    }

    public FinancialTotalVTO totalEnrollmentPayments(Integer totalEnrollmentPayments) {
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

    public FinancialTotalVTO totalEnrollmentRefunds(Integer totalEnrollmentRefunds) {
        this.totalEnrollmentRefunds = totalEnrollmentRefunds;
        return this;
    }

    /**
     * Get totalEnrollmentRefunds
     *
     * @return totalEnrollmentRefunds
     */

    @Schema(name = "totalEnrollmentRefunds", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalEnrollmentRefunds")
    public Integer getTotalEnrollmentRefunds() {
        return totalEnrollmentRefunds;
    }

    public void setTotalEnrollmentRefunds(Integer totalEnrollmentRefunds) {
        this.totalEnrollmentRefunds = totalEnrollmentRefunds;
    }

    public FinancialTotalVTO totalExpenses(Integer totalExpenses) {
        this.totalExpenses = totalExpenses;
        return this;
    }

    /**
     * Get totalExpenses
     *
     * @return totalExpenses
     */

    @Schema(name = "totalExpenses", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalExpenses")
    public Integer getTotalExpenses() {
        return totalExpenses;
    }

    public void setTotalExpenses(Integer totalExpenses) {
        this.totalExpenses = totalExpenses;
    }

    public FinancialTotalVTO activeEnrollmentsCount(Integer activeEnrollmentsCount) {
        this.activeEnrollmentsCount = activeEnrollmentsCount;
        return this;
    }

    /**
     * Get activeEnrollmentsCount
     *
     * @return activeEnrollmentsCount
     */

    @Schema(name = "activeEnrollmentsCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("activeEnrollmentsCount")
    public Integer getActiveEnrollmentsCount() {
        return activeEnrollmentsCount;
    }

    public void setActiveEnrollmentsCount(Integer activeEnrollmentsCount) {
        this.activeEnrollmentsCount = activeEnrollmentsCount;
    }

    public FinancialTotalVTO activeCoursesCount(Integer activeCoursesCount) {
        this.activeCoursesCount = activeCoursesCount;
        return this;
    }

    /**
     * Get activeCoursesCount
     *
     * @return activeCoursesCount
     */

    @Schema(name = "activeCoursesCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("activeCoursesCount")
    public Integer getActiveCoursesCount() {
        return activeCoursesCount;
    }

    public void setActiveCoursesCount(Integer activeCoursesCount) {
        this.activeCoursesCount = activeCoursesCount;
    }

    public FinancialTotalVTO activeTraineesCount(Integer activeTraineesCount) {
        this.activeTraineesCount = activeTraineesCount;
        return this;
    }

    /**
     * Get activeTraineesCount
     *
     * @return activeTraineesCount
     */

    @Schema(name = "activeTraineesCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("activeTraineesCount")
    public Integer getActiveTraineesCount() {
        return activeTraineesCount;
    }

    public void setActiveTraineesCount(Integer activeTraineesCount) {
        this.activeTraineesCount = activeTraineesCount;
    }

    public FinancialTotalVTO activeEmployeesCount(Integer activeEmployeesCount) {
        this.activeEmployeesCount = activeEmployeesCount;
        return this;
    }

    /**
     * Get activeEmployeesCount
     *
     * @return activeEmployeesCount
     */

    @Schema(name = "activeEmployeesCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("activeEmployeesCount")
    public Integer getActiveEmployeesCount() {
        return activeEmployeesCount;
    }

    public void setActiveEmployeesCount(Integer activeEmployeesCount) {
        this.activeEmployeesCount = activeEmployeesCount;
    }

    public FinancialTotalVTO inactiveEnrollmentsCount(Integer inactiveEnrollmentsCount) {
        this.inactiveEnrollmentsCount = inactiveEnrollmentsCount;
        return this;
    }

    /**
     * Get inactiveEnrollmentsCount
     *
     * @return inactiveEnrollmentsCount
     */

    @Schema(name = "inactiveEnrollmentsCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("inactiveEnrollmentsCount")
    public Integer getInactiveEnrollmentsCount() {
        return inactiveEnrollmentsCount;
    }

    public void setInactiveEnrollmentsCount(Integer inactiveEnrollmentsCount) {
        this.inactiveEnrollmentsCount = inactiveEnrollmentsCount;
    }

    public FinancialTotalVTO inactiveCoursesCount(Integer inactiveCoursesCount) {
        this.inactiveCoursesCount = inactiveCoursesCount;
        return this;
    }

    /**
     * Get inactiveCoursesCount
     *
     * @return inactiveCoursesCount
     */

    @Schema(name = "inactiveCoursesCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("inactiveCoursesCount")
    public Integer getInactiveCoursesCount() {
        return inactiveCoursesCount;
    }

    public void setInactiveCoursesCount(Integer inactiveCoursesCount) {
        this.inactiveCoursesCount = inactiveCoursesCount;
    }

    public FinancialTotalVTO inactiveTraineesCount(Integer inactiveTraineesCount) {
        this.inactiveTraineesCount = inactiveTraineesCount;
        return this;
    }

    /**
     * Get inactiveTraineesCount
     *
     * @return inactiveTraineesCount
     */

    @Schema(name = "inactiveTraineesCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("inactiveTraineesCount")
    public Integer getInactiveTraineesCount() {
        return inactiveTraineesCount;
    }

    public void setInactiveTraineesCount(Integer inactiveTraineesCount) {
        this.inactiveTraineesCount = inactiveTraineesCount;
    }

    public FinancialTotalVTO inactiveEmployeesCount(Integer inactiveEmployeesCount) {
        this.inactiveEmployeesCount = inactiveEmployeesCount;
        return this;
    }

    /**
     * Get inactiveEmployeesCount
     *
     * @return inactiveEmployeesCount
     */

    @Schema(name = "inactiveEmployeesCount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("inactiveEmployeesCount")
    public Integer getInactiveEmployeesCount() {
        return inactiveEmployeesCount;
    }

    public void setInactiveEmployeesCount(Integer inactiveEmployeesCount) {
        this.inactiveEmployeesCount = inactiveEmployeesCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FinancialTotalVTO financialTotalVTO = (FinancialTotalVTO) o;
        return Objects.equals(this.totalSalary, financialTotalVTO.totalSalary)
                && Objects.equals(this.totalAdvance, financialTotalVTO.totalAdvance)
                && Objects.equals(this.totalIncentives, financialTotalVTO.totalIncentives)
                && Objects.equals(this.totalPlacesGained, financialTotalVTO.totalPlacesGained)
                && Objects.equals(this.totalPlacesRent, financialTotalVTO.totalPlacesRent)
                && Objects.equals(this.totalEnrollmentPayments, financialTotalVTO.totalEnrollmentPayments)
                && Objects.equals(this.totalEnrollmentRefunds, financialTotalVTO.totalEnrollmentRefunds)
                && Objects.equals(this.totalExpenses, financialTotalVTO.totalExpenses)
                && Objects.equals(this.activeEnrollmentsCount, financialTotalVTO.activeEnrollmentsCount)
                && Objects.equals(this.activeCoursesCount, financialTotalVTO.activeCoursesCount)
                && Objects.equals(this.activeTraineesCount, financialTotalVTO.activeTraineesCount)
                && Objects.equals(this.activeEmployeesCount, financialTotalVTO.activeEmployeesCount)
                && Objects.equals(this.inactiveEnrollmentsCount, financialTotalVTO.inactiveEnrollmentsCount)
                && Objects.equals(this.inactiveCoursesCount, financialTotalVTO.inactiveCoursesCount)
                && Objects.equals(this.inactiveTraineesCount, financialTotalVTO.inactiveTraineesCount)
                && Objects.equals(this.inactiveEmployeesCount, financialTotalVTO.inactiveEmployeesCount);
    }

    @Override
    public int hashCode() {
        return Objects.hash(totalSalary, totalAdvance, totalIncentives, totalPlacesGained, totalPlacesRent,
                totalEnrollmentPayments, totalEnrollmentRefunds, totalExpenses, activeEnrollmentsCount,
                activeCoursesCount, activeTraineesCount, activeEmployeesCount, inactiveEnrollmentsCount,
                inactiveCoursesCount, inactiveTraineesCount, inactiveEmployeesCount);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class FinancialTotalVTO {\n");
        sb.append("    totalSalary: ").append(toIndentedString(totalSalary)).append("\n");
        sb.append("    totalAdvance: ").append(toIndentedString(totalAdvance)).append("\n");
        sb.append("    totalIncentives: ").append(toIndentedString(totalIncentives)).append("\n");
        sb.append("    totalPlacesGained: ").append(toIndentedString(totalPlacesGained)).append("\n");
        sb.append("    totalPlacesRent: ").append(toIndentedString(totalPlacesRent)).append("\n");
        sb.append("    totalEnrollmentPayments: ").append(toIndentedString(totalEnrollmentPayments)).append("\n");
        sb.append("    totalEnrollmentRefunds: ").append(toIndentedString(totalEnrollmentRefunds)).append("\n");
        sb.append("    totalExpenses: ").append(toIndentedString(totalExpenses)).append("\n");
        sb.append("    activeEnrollmentsCount: ").append(toIndentedString(activeEnrollmentsCount)).append("\n");
        sb.append("    activeCoursesCount: ").append(toIndentedString(activeCoursesCount)).append("\n");
        sb.append("    activeTraineesCount: ").append(toIndentedString(activeTraineesCount)).append("\n");
        sb.append("    activeEmployeesCount: ").append(toIndentedString(activeEmployeesCount)).append("\n");
        sb.append("    inactiveEnrollmentsCount: ").append(toIndentedString(inactiveEnrollmentsCount)).append("\n");
        sb.append("    inactiveCoursesCount: ").append(toIndentedString(inactiveCoursesCount)).append("\n");
        sb.append("    inactiveTraineesCount: ").append(toIndentedString(inactiveTraineesCount)).append("\n");
        sb.append("    inactiveEmployeesCount: ").append(toIndentedString(inactiveEmployeesCount)).append("\n");
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
