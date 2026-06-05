package bs.service.financial.model.generated;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * ExpenseDTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class ExpenseDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate expenseDate;

    private Integer amountExpensed;

    private Integer paymentMethodId;

    private Integer expenseTypeId;

    @Valid
    private List<String> imagesUrls = new ArrayList<>();

    private String note;

    public ExpenseDTO expenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
        return this;
    }

    /**
     * Get expenseDate
     *
     * @return expenseDate
     */
    @NotNull
    @Valid
    @Schema(name = "expenseDate", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("expenseDate")
    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public ExpenseDTO amountExpensed(Integer amountExpensed) {
        this.amountExpensed = amountExpensed;
        return this;
    }

    /**
     * Get amountExpensed
     *
     * @return amountExpensed
     */
    @NotNull
    @Schema(name = "amountExpensed", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("amountExpensed")
    public Integer getAmountExpensed() {
        return amountExpensed;
    }

    public void setAmountExpensed(Integer amountExpensed) {
        this.amountExpensed = amountExpensed;
    }

    public ExpenseDTO paymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
        return this;
    }

    /**
     * Get paymentMethodId
     *
     * @return paymentMethodId
     */

    @Schema(name = "paymentMethodId", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentMethodId")
    public Integer getPaymentMethodId() {
        return paymentMethodId;
    }

    public void setPaymentMethodId(Integer paymentMethodId) {
        this.paymentMethodId = paymentMethodId;
    }

    public ExpenseDTO expenseTypeId(Integer expenseTypeId) {
        this.expenseTypeId = expenseTypeId;
        return this;
    }

    /**
     * Get expenseTypeId
     *
     * @return expenseTypeId
     */
    @NotNull
    @Schema(name = "expenseTypeId", requiredMode = Schema.RequiredMode.REQUIRED)
    @JsonProperty("expenseTypeId")
    public Integer getExpenseTypeId() {
        return expenseTypeId;
    }

    public void setExpenseTypeId(Integer expenseTypeId) {
        this.expenseTypeId = expenseTypeId;
    }

    public ExpenseDTO imagesUrls(List<String> imagesUrls) {
        this.imagesUrls = imagesUrls;
        return this;
    }

    public ExpenseDTO addImagesUrlsItem(String imagesUrlsItem) {
        if (this.imagesUrls == null) {
            this.imagesUrls = new ArrayList<>();
        }
        this.imagesUrls.add(imagesUrlsItem);
        return this;
    }

    /**
     * Get imagesUrls
     *
     * @return imagesUrls
     */

    @Schema(name = "imagesUrls", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("imagesUrls")
    public List<String> getImagesUrls() {
        return imagesUrls;
    }

    public void setImagesUrls(List<String> imagesUrls) {
        this.imagesUrls = imagesUrls;
    }

    public ExpenseDTO note(String note) {
        this.note = note;
        return this;
    }

    /**
     * Get note
     *
     * @return note
     */

    @Schema(name = "note", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("note")
    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ExpenseDTO expenseDTO = (ExpenseDTO) o;
        return Objects.equals(this.expenseDate, expenseDTO.expenseDate)
                && Objects.equals(this.amountExpensed, expenseDTO.amountExpensed)
                && Objects.equals(this.paymentMethodId, expenseDTO.paymentMethodId)
                && Objects.equals(this.expenseTypeId, expenseDTO.expenseTypeId)
                && Objects.equals(this.imagesUrls, expenseDTO.imagesUrls) && Objects.equals(this.note, expenseDTO.note);
    }

    @Override
    public int hashCode() {
        return Objects.hash(expenseDate, amountExpensed, paymentMethodId, expenseTypeId, imagesUrls, note);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ExpenseDTO {\n");
        sb.append("    expenseDate: ").append(toIndentedString(expenseDate)).append("\n");
        sb.append("    amountExpensed: ").append(toIndentedString(amountExpensed)).append("\n");
        sb.append("    paymentMethodId: ").append(toIndentedString(paymentMethodId)).append("\n");
        sb.append("    expenseTypeId: ").append(toIndentedString(expenseTypeId)).append("\n");
        sb.append("    imagesUrls: ").append(toIndentedString(imagesUrls)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
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
