package bs.service.employee.model.generated;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonValue;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;

/**
 * SessionStatus
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class SessionStatus implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Gets or Sets id
     */
    public enum IdEnum {
        NUMBER_1(1),

        NUMBER_2(2),

        NUMBER_3(3),

        NUMBER_4(4);

        private Integer value;

        IdEnum(Integer value) {
            this.value = value;
        }

        @JsonValue
        public Integer getValue() {
            return value;
        }

        @Override
        public String toString() {
            return String.valueOf(value);
        }

        @JsonCreator
        public static IdEnum fromValue(Integer value) {
            for (IdEnum b : IdEnum.values()) {
                if (b.value.equals(value)) {
                    return b;
                }
            }
            throw new IllegalArgumentException("Unexpected value '" + value + "'");
        }
    }

    private IdEnum id;

    /**
     * Gets or Sets code
     */
    public enum CodeEnum {
        SCHEDULED("SCHEDULED"),

        IN_PROGRESS("IN_PROGRESS"),

        COMPLETED("COMPLETED"),

        CANCELLED("CANCELLED");

        private String value;

        CodeEnum(String value) {
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
        public static CodeEnum fromValue(String value) {
            for (CodeEnum b : CodeEnum.values()) {
                if (b.value.equals(value)) {
                    return b;
                }
            }
            throw new IllegalArgumentException("Unexpected value '" + value + "'");
        }
    }

    private CodeEnum code;

    /**
     * Gets or Sets arabicLabel
     */
    public enum ArabicLabelEnum {
        u("مجدول"),

        u2("في تقدم"),

        u3("مكتمل"),

        u4("ملغي");

        private String value;

        ArabicLabelEnum(String value) {
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
        public static ArabicLabelEnum fromValue(String value) {
            for (ArabicLabelEnum b : ArabicLabelEnum.values()) {
                if (b.value.equals(value)) {
                    return b;
                }
            }
            throw new IllegalArgumentException("Unexpected value '" + value + "'");
        }
    }

    private ArabicLabelEnum arabicLabel;

    public SessionStatus id(IdEnum id) {
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
    public IdEnum getId() {
        return id;
    }

    public void setId(IdEnum id) {
        this.id = id;
    }

    public SessionStatus code(CodeEnum code) {
        this.code = code;
        return this;
    }

    /**
     * Get code
     *
     * @return code
     */

    @Schema(name = "code", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("code")
    public CodeEnum getCode() {
        return code;
    }

    public void setCode(CodeEnum code) {
        this.code = code;
    }

    public SessionStatus arabicLabel(ArabicLabelEnum arabicLabel) {
        this.arabicLabel = arabicLabel;
        return this;
    }

    /**
     * Get arabicLabel
     *
     * @return arabicLabel
     */

    @Schema(name = "arabicLabel", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("arabicLabel")
    public ArabicLabelEnum getArabicLabel() {
        return arabicLabel;
    }

    public void setArabicLabel(ArabicLabelEnum arabicLabel) {
        this.arabicLabel = arabicLabel;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        SessionStatus sessionStatus = (SessionStatus) o;
        return Objects.equals(this.id, sessionStatus.id) && Objects.equals(this.code, sessionStatus.code)
                && Objects.equals(this.arabicLabel, sessionStatus.arabicLabel);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, code, arabicLabel);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class SessionStatus {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    code: ").append(toIndentedString(code)).append("\n");
        sb.append("    arabicLabel: ").append(toIndentedString(arabicLabel)).append("\n");
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
