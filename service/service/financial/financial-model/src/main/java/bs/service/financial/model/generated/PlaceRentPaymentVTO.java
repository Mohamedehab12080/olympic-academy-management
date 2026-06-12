package bs.service.financial.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.place.model.generated.PlaceVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * PlaceRentPaymentVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class PlaceRentPaymentVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private PlaceVTO place;

    private Integer rentAmount;

    private Integer payedAmount;

    private Integer remainedAmount;

    private LookupVTO rentType;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate paymentDate;

    private LookupVTO paymentMethod;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public PlaceRentPaymentVTO id(Integer id) {
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

    public PlaceRentPaymentVTO place(PlaceVTO place) {
        this.place = place;
        return this;
    }

    /**
     * Get place
     *
     * @return place
     */
    @Valid
    @Schema(name = "place", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("place")
    public PlaceVTO getPlace() {
        return place;
    }

    public void setPlace(PlaceVTO place) {
        this.place = place;
    }

    public PlaceRentPaymentVTO rentAmount(Integer rentAmount) {
        this.rentAmount = rentAmount;
        return this;
    }

    /**
     * Get rentAmount
     *
     * @return rentAmount
     */

    @Schema(name = "rentAmount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("rentAmount")
    public Integer getRentAmount() {
        return rentAmount;
    }

    public void setRentAmount(Integer rentAmount) {
        this.rentAmount = rentAmount;
    }

    public PlaceRentPaymentVTO payedAmount(Integer payedAmount) {
        this.payedAmount = payedAmount;
        return this;
    }

    /**
     * Get payedAmount
     *
     * @return payedAmount
     */

    @Schema(name = "payedAmount", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("payedAmount")
    public Integer getPayedAmount() {
        return payedAmount;
    }

    public void setPayedAmount(Integer payedAmount) {
        this.payedAmount = payedAmount;
    }

    public PlaceRentPaymentVTO remainedAmount(Integer remainedAmount) {
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

    public PlaceRentPaymentVTO rentType(LookupVTO rentType) {
        this.rentType = rentType;
        return this;
    }

    /**
     * Get rentType
     *
     * @return rentType
     */
    @Valid
    @Schema(name = "rentType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("rentType")
    public LookupVTO getRentType() {
        return rentType;
    }

    public void setRentType(LookupVTO rentType) {
        this.rentType = rentType;
    }

    public PlaceRentPaymentVTO paymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
        return this;
    }

    /**
     * Get paymentDate
     *
     * @return paymentDate
     */
    @Valid
    @Schema(name = "paymentDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentDate")
    public LocalDate getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDate paymentDate) {
        this.paymentDate = paymentDate;
    }

    public PlaceRentPaymentVTO paymentMethod(LookupVTO paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;
    }

    /**
     * Get paymentMethod
     *
     * @return paymentMethod
     */
    @Valid
    @Schema(name = "paymentMethod", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentMethod")
    public LookupVTO getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(LookupVTO paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public PlaceRentPaymentVTO createdOn(LocalDateTime createdOn) {
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

    public PlaceRentPaymentVTO createdBy(LightUserVTO createdBy) {
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

    public PlaceRentPaymentVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
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

    public PlaceRentPaymentVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
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
        PlaceRentPaymentVTO placeRentPaymentVTO = (PlaceRentPaymentVTO) o;
        return Objects.equals(this.id, placeRentPaymentVTO.id) && Objects.equals(this.place, placeRentPaymentVTO.place)
                && Objects.equals(this.rentAmount, placeRentPaymentVTO.rentAmount)
                && Objects.equals(this.payedAmount, placeRentPaymentVTO.payedAmount)
                && Objects.equals(this.remainedAmount, placeRentPaymentVTO.remainedAmount)
                && Objects.equals(this.rentType, placeRentPaymentVTO.rentType)
                && Objects.equals(this.paymentDate, placeRentPaymentVTO.paymentDate)
                && Objects.equals(this.paymentMethod, placeRentPaymentVTO.paymentMethod)
                && Objects.equals(this.createdOn, placeRentPaymentVTO.createdOn)
                && Objects.equals(this.createdBy, placeRentPaymentVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, placeRentPaymentVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, placeRentPaymentVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, place, rentAmount, payedAmount, remainedAmount, rentType, paymentDate, paymentMethod,
                createdOn, createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class PlaceRentPaymentVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    place: ").append(toIndentedString(place)).append("\n");
        sb.append("    rentAmount: ").append(toIndentedString(rentAmount)).append("\n");
        sb.append("    payedAmount: ").append(toIndentedString(payedAmount)).append("\n");
        sb.append("    remainedAmount: ").append(toIndentedString(remainedAmount)).append("\n");
        sb.append("    rentType: ").append(toIndentedString(rentType)).append("\n");
        sb.append("    paymentDate: ").append(toIndentedString(paymentDate)).append("\n");
        sb.append("    paymentMethod: ").append(toIndentedString(paymentMethod)).append("\n");
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
