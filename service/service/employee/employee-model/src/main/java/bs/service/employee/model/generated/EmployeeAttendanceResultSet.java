package bs.service.employee.model.generated;

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
 * EmployeeAttendanceResultSet
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class EmployeeAttendanceResultSet implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer total;

    @Valid
    private List<@Valid EmployeeAttendanceListItem> items = new ArrayList<>();

    public EmployeeAttendanceResultSet total(Integer total) {
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

    public EmployeeAttendanceResultSet items(List<@Valid EmployeeAttendanceListItem> items) {
        this.items = items;
        return this;
    }

    public EmployeeAttendanceResultSet addItemsItem(EmployeeAttendanceListItem itemsItem) {
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
    public List<@Valid EmployeeAttendanceListItem> getItems() {
        return items;
    }

    public void setItems(List<@Valid EmployeeAttendanceListItem> items) {
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
        EmployeeAttendanceResultSet employeeAttendanceResultSet = (EmployeeAttendanceResultSet) o;
        return Objects.equals(this.total, employeeAttendanceResultSet.total)
                && Objects.equals(this.items, employeeAttendanceResultSet.items);
    }

    @Override
    public int hashCode() {
        return Objects.hash(total, items);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class EmployeeAttendanceResultSet {\n");
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
