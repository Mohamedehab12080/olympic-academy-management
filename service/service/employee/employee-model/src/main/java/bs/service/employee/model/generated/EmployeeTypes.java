package bs.service.employee.model.generated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.util.*;
import org.hibernate.validator.constraints.*;

/**
 * Gets or Sets EmployeeTypes
 */

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public enum EmployeeTypes {

    TRAINER("TRAINER"),

    MANAGER("MANAGER");

    private String value;

    EmployeeTypes(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return String.valueOf(value);
    }

    @JsonCreator
    public static EmployeeTypes fromValue(String value) {
        for (EmployeeTypes b : EmployeeTypes.values()) {
            if (b.value.equals(value)) {
                return b;
            }
        }
        throw new IllegalArgumentException("Unexpected value '" + value + "'");
    }
}
