package bs.service.place.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * PlaceDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class PlaceDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String title;

    private Integer rentValue;

    private Integer remainedValue;

    private String address;

    private String phoneNumber;

    public PlaceDTO title(String title) {
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

    public PlaceDTO rentValue(Integer rentValue) {
        this.rentValue = rentValue;
        return this;
    }

    /**
     * Get rentValue
     *
     * @return rentValue
     */

    @Schema(name = "rentValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("rentValue")
    public Integer getRentValue() {
        return rentValue;
    }

    public void setRentValue(Integer rentValue) {
        this.rentValue = rentValue;
    }

    public PlaceDTO remainedValue(Integer remainedValue) {
        this.remainedValue = remainedValue;
        return this;
    }

    /**
     * Get remainedValue
     *
     * @return remainedValue
     */

    @Schema(name = "remainedValue", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("remainedValue")
    public Integer getRemainedValue() {
        return remainedValue;
    }

    public void setRemainedValue(Integer remainedValue) {
        this.remainedValue = remainedValue;
    }

    public PlaceDTO address(String address) {
        this.address = address;
        return this;
    }

    /**
     * Get address
     *
     * @return address
     */

    @Schema(name = "address", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("address")
    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public PlaceDTO phoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
        return this;
    }

    /**
     * Get phoneNumber
     *
     * @return phoneNumber
     */

    @Schema(name = "phoneNumber", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("phoneNumber")
    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        PlaceDTO placeDTO = (PlaceDTO) o;
        return Objects.equals(this.title, placeDTO.title) && Objects.equals(this.rentValue, placeDTO.rentValue)
                && Objects.equals(this.remainedValue, placeDTO.remainedValue)
                && Objects.equals(this.address, placeDTO.address)
                && Objects.equals(this.phoneNumber, placeDTO.phoneNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(title, rentValue, remainedValue, address, phoneNumber);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class PlaceDTO {\n");
        sb.append("    title: ").append(toIndentedString(title)).append("\n");
        sb.append("    rentValue: ").append(toIndentedString(rentValue)).append("\n");
        sb.append("    remainedValue: ").append(toIndentedString(remainedValue)).append("\n");
        sb.append("    address: ").append(toIndentedString(address)).append("\n");
        sb.append("    phoneNumber: ").append(toIndentedString(phoneNumber)).append("\n");
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
