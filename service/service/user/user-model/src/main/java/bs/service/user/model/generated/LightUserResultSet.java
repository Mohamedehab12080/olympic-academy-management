package bs.service.user.model.generated;

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
 * LightUserResultSet
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class LightUserResultSet implements Serializable {

    private static final long serialVersionUID = 1L;

    @Valid
    private List<@Valid LightUserVTO> _list = new ArrayList<>();

    private Integer total;

    public LightUserResultSet _list(List<@Valid LightUserVTO> _list) {
        this._list = _list;
        return this;
    }

    public LightUserResultSet addListItem(LightUserVTO _listItem) {
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
    public List<@Valid LightUserVTO> getList() {
        return _list;
    }

    public void setList(List<@Valid LightUserVTO> _list) {
        this._list = _list;
    }

    public LightUserResultSet total(Integer total) {
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
        LightUserResultSet lightUserResultSet = (LightUserResultSet) o;
        return Objects.equals(this._list, lightUserResultSet._list)
                && Objects.equals(this.total, lightUserResultSet.total);
    }

    @Override
    public int hashCode() {
        return Objects.hash(_list, total);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class LightUserResultSet {\n");
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
