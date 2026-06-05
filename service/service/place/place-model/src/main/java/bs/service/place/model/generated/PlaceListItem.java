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
 * PlaceListItem
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class PlaceListItem implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    private String title;

    private Integer rentValue;

    private Integer remainedValue;

    private String address;

    private String phoneNumber;

    public PlaceListItem id(Integer id) {
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

    public PlaceListItem title(String title) {
        this.title = title;
        return this;
    }

    /**
     * Get title
     *
     * @return title
     */

    @Schema(name = "title", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("title")
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public PlaceListItem rentValue(Integer rentValue) {
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

    public PlaceListItem remainedValue(Integer remainedValue) {
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

    public PlaceListItem address(String address) {
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

    public PlaceListItem phoneNumber(String phoneNumber) {
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
        PlaceListItem placeListItem = (PlaceListItem) o;
        return Objects.equals(this.id, placeListItem.id) && Objects.equals(this.title, placeListItem.title)
                && Objects.equals(this.rentValue, placeListItem.rentValue)
                && Objects.equals(this.remainedValue, placeListItem.remainedValue)
                && Objects.equals(this.address, placeListItem.address)
                && Objects.equals(this.phoneNumber, placeListItem.phoneNumber);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title, rentValue, remainedValue, address, phoneNumber);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class PlaceListItem {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
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
