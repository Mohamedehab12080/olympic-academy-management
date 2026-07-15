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
 * PlaceReportVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class PlaceReportVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer totalPayed;

    private Integer totalGained;

    public PlaceReportVTO totalPayed(Integer totalPayed) {
        this.totalPayed = totalPayed;
        return this;
    }

    /**
     * Get totalPayed
     *
     * @return totalPayed
     */

    @Schema(name = "totalPayed", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("totalPayed")
    public Integer getTotalPayed() {
        return totalPayed;
    }

    public void setTotalPayed(Integer totalPayed) {
        this.totalPayed = totalPayed;
    }

    public PlaceReportVTO totalGained(Integer totalGained) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PlaceReportVTO placeReportVTO = (PlaceReportVTO) o;
        return Objects.equals(this.totalPayed, placeReportVTO.totalPayed)
                && Objects.equals(this.totalGained, placeReportVTO.totalGained);
    }

    @Override
    public int hashCode() {
        return Objects.hash(totalPayed, totalGained);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class PlaceReportVTO {\n");
        sb.append("    totalPayed: ").append(toIndentedString(totalPayed)).append("\n");
        sb.append("    totalGained: ").append(toIndentedString(totalGained)).append("\n");
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
