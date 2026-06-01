package bs.lib.common.model.generated;

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
 * LookupResultSet
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class LookupResultSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Valid
    private List<@Valid LookupVTO> _list = new ArrayList<>();

    private Integer total;

    public LookupResultSet _list(List<@Valid LookupVTO> _list) {
        this._list = _list;
        return this;
    }

    public LookupResultSet addListItem(LookupVTO _listItem) {
        if (this._list == null) {
            this._list = new ArrayList<>();
        }
        this._list.add(_listItem);
        return this;
    }

    /**
     * Get _list
     *
     * @return _list
     */
    @Valid
    @Schema(name = "list", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("list")
    public List<@Valid LookupVTO> getList() {
        return _list;
    }

    public void setList(List<@Valid LookupVTO> _list) {
        this._list = _list;
    }

    public LookupResultSet total(Integer total) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        LookupResultSet lookupResultSet = (LookupResultSet) o;
        return Objects.equals(this._list, lookupResultSet._list) && Objects.equals(this.total, lookupResultSet.total);
    }

    @Override
    public int hashCode() {
        return Objects.hash(_list, total);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class LookupResultSet {\n");
        sb.append("    _list: ").append(toIndentedString(_list)).append("\n");
        sb.append("    total: ").append(toIndentedString(total)).append("\n");
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
