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
 * AssignDepartmentDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class AssignDepartmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Valid
    private List<Integer> departmentId = new ArrayList<>();

    public AssignDepartmentDTO departmentId(List<Integer> departmentId) {
        this.departmentId = departmentId;
        return this;
    }

    public AssignDepartmentDTO addDepartmentIdItem(Integer departmentIdItem) {
        if (this.departmentId == null) {
            this.departmentId = new ArrayList<>();
        }
        this.departmentId.add(departmentIdItem);
        return this;
    }

    /**
     * Get departmentId
     *
     * @return departmentId
     */
    @NotNull
    @Schema(name = "departmentId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("departmentId")
    public List<Integer> getDepartmentId() {
        return departmentId;
    }

    public void setDepartmentId(List<Integer> departmentId) {
        this.departmentId = departmentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        AssignDepartmentDTO assignDepartmentDTO = (AssignDepartmentDTO) o;
        return Objects.equals(this.departmentId, assignDepartmentDTO.departmentId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(departmentId);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class AssignDepartmentDTO {\n");
        sb.append("    departmentId: ").append(toIndentedString(departmentId)).append("\n");
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
