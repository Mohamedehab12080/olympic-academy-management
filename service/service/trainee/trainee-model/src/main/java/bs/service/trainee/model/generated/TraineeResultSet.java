package bs.service.trainee.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * TraineeResultSet
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class TraineeResultSet implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer total;

    @Valid
    private List<@Valid TraineeListItem> items = new ArrayList<>();

    public TraineeResultSet total(Integer total) {
        this.total = total;
        return this;
    }

    /**
     * Get total
     *
     * @return total
     */

    @Schema(name = "total", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("total")
    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public TraineeResultSet items(List<@Valid TraineeListItem> items) {
        this.items = items;
        return this;
    }

    public TraineeResultSet addItemsItem(TraineeListItem itemsItem) {
        if (this.items == null) {
            this.items = new ArrayList<>();
        }
        this.items.add(itemsItem);
        return this;
    }

    /**
     * Get items
     *
     * @return items
     */
    @Valid
    @Schema(name = "items", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("items")
    public List<@Valid TraineeListItem> getItems() {
        return items;
    }

    public void setItems(List<@Valid TraineeListItem> items) {
        this.items = items;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        TraineeResultSet traineeResultSet = (TraineeResultSet) o;
        return Objects.equals(this.total, traineeResultSet.total) && Objects.equals(this.items, traineeResultSet.items);
    }

    @Override
    public int hashCode() {
        return Objects.hash(total, items);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class TraineeResultSet {\n");
        sb.append("    total: ").append(toIndentedString(total)).append("\n");
        sb.append("    items: ").append(toIndentedString(items)).append("\n");
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
