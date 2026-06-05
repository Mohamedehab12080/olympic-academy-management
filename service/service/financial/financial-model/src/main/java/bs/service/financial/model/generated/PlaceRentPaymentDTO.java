package bs.service.financial.model.generated;

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
 * PlaceRentPaymentDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class PlaceRentPaymentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer placeId;

    private Integer rentAmount;

    private Integer payedAmount;

    private Integer remainedAmount;

    private Integer rentTypeId;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate paymentDate;

    private Integer paymentMethodId;

    public PlaceRentPaymentDTO placeId(Integer placeId) {
        this.placeId = placeId;
        return this;
    }

    /**
     * Get placeId
     *
     * @return placeId
     */
    @NotNull
    @Schema(name = "placeId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("placeId")
    public Integer getPlaceId() {
        return placeId;
    }

    public void setPlaceId(Integer placeId) {
        this.placeId = placeId;
    }

    public PlaceRentPaymentDTO rentAmount(Integer rentAmount) {
        this.rentAmount = rentAmount;
        return this;
    }

    /**
     * Get rentAmount
     *
     * @return rentAmount
     */
    @NotNull
    @Schema(name = "rentAmount", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("rentAmount")
    public Integer getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Integer rentAmount) {
        this.rentAmount = rentAmount;
    }

    public PlaceRentPaymentDTO payedAmount(Integer payedAmount) {
        this.payedAmount = payedAmount;
        return this;
    }

    /**
     * Get payedAmount
     *
     * @return payedAmount
     */
    @NotNull
    @Schema(name = "payedAmount", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("payedAmount")
    public Integer getPayedAmount() {
        return payedAmount;
    }

    public void setPayedAmount(Integer payedAmount) {
        this.payedAmount = payedAmount;
    }

    public PlaceRentPaymentDTO remainedAmount(Integer remainedAmount) {
        this.remainedAmount = remainedAmount;
        return this;
    }

    /**
     * Get remainedAmount
     *
     * @return remainedAmount
     */

    @Schema(name = "remainedAmount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("remainedAmount")
    public Integer getRemainedAmount() {
        return remainedAmount;
    }

    public void setRemainedAmount(Integer remainedAmount) {
        this.remainedAmount = remainedAmount;
    }

    public PlaceRentPaymentDTO rentTypeId(Integer rentTypeId) {
        this.rentTypeId = rentTypeId;
        return this;
    }

    /**
     * Get rentTypeId
     *
     * @return rentTypeId
     */

    @Schema(name = "rentTypeId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("rentTypeId")
    public Integer getRentTypeId() {
        return rentTypeId;
    }

    public void setRentTypeId(Integer rentTypeId) {
        this.rentTypeId = rentTypeId;
    }

    public PlaceRentPaymentDTO paymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
        return this;
    }

    /**
     * Get paymentDate
     *
     * @return paymentDate
     */
    @NotNull
    @Valid
    @Schema(name = "paymentDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("paymentDate")
    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PlaceRentPaymentDTO paymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
        return this;
    }

    /**
     * Get paymentMethodId
     *
     * @return paymentMethodId
     */

    @Schema(name = "paymentMethodId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentMethodId")
    public Integer getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PlaceRentPaymentDTO placeRentPaymentDTO = (PlaceRentPaymentDTO) o;
        return Objects.equals(this.placeId, placeRentPaymentDTO.placeId)
                && Objects.equals(this.rentAmount, placeRentPaymentDTO.rentAmount)
                && Objects.equals(this.payedAmount, placeRentPaymentDTO.payedAmount)
                && Objects.equals(this.remainedAmount, placeRentPaymentDTO.remainedAmount)
                && Objects.equals(this.rentTypeId, placeRentPaymentDTO.rentTypeId)
                && Objects.equals(this.paymentDate, placeRentPaymentDTO.paymentDate)
                && Objects.equals(this.paymentMethodId, placeRentPaymentDTO.paymentMethodId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(placeId, rentAmount, payedAmount, remainedAmount, rentTypeId, paymentDate, paymentMethodId);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class PlaceRentPaymentDTO {\n");
        sb.append("    placeId: ").append(toIndentedString(placeId)).append("\n");
        sb.append("    rentAmount: ").append(toIndentedString(rentAmount)).append("\n");
        sb.append("    payedAmount: ").append(toIndentedString(payedAmount)).append("\n");
        sb.append("    remainedAmount: ").append(toIndentedString(remainedAmount)).append("\n");
        sb.append("    rentTypeId: ").append(toIndentedString(rentTypeId)).append("\n");
        sb.append("    paymentDate: ").append(toIndentedString(paymentDate)).append("\n");
        sb.append("    paymentMethodId: ").append(toIndentedString(paymentMethodId)).append("\n");
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
