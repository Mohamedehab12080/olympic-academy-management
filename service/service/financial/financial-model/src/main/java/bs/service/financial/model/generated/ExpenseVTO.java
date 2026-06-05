package bs.service.financial.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * ExpenseVTO
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class ExpenseVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Integer id;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate expenseDate;

    private Integer amountExpensed;

    private LookupVTO paymentMethod;

    private LookupVTO expenseType;

    @Valid
    private List<String> imagesUrls = new ArrayList<>();

    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime lastModifiedOn;

    private LightUserVTO lastModifiedBy;

    public ExpenseVTO id(Integer id) {
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

    public ExpenseVTO expenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
        return this;
    }

    /**
     * Get expenseDate
     *
     * @return expenseDate
     */
    @Valid
    @Schema(name = "expenseDate", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("expenseDate")
    public LocalDate getExpenseDate() {
        return expenseDate;
    }

    public void setExpenseDate(LocalDate expenseDate) {
        this.expenseDate = expenseDate;
    }

    public ExpenseVTO amountExpensed(Integer amountExpensed) {
        this.amountExpensed = amountExpensed;
        return this;
    }

    /**
     * Get amountExpensed
     *
     * @return amountExpensed
     */

    @Schema(name = "amountExpensed", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("amountExpensed")
    public Integer getAmountExpensed() {
        return amountExpensed;
    }

    public void setAmountExpensed(Integer amountExpensed) {
        this.amountExpensed = amountExpensed;
    }

    public ExpenseVTO paymentMethod(LookupVTO paymentMethod) {
        this.paymentMethod = paymentMethod;
        return this;
    }

    /**
     * Get paymentMethod
     *
     * @return paymentMethod
     */
    @Valid
    @Schema(name = "paymentMethod", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("paymentMethod")
    public LookupVTO getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(LookupVTO paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public ExpenseVTO expenseType(LookupVTO expenseType) {
        this.expenseType = expenseType;
        return this;
    }

    /**
     * Get expenseType
     *
     * @return expenseType
     */
    @Valid
    @Schema(name = "expenseType", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("expenseType")
    public LookupVTO getExpenseType() {
        return expenseType;
    }

    public void setExpenseType(LookupVTO expenseType) {
        this.expenseType = expenseType;
    }

    public ExpenseVTO imagesUrls(List<String> imagesUrls) {
        this.imagesUrls = imagesUrls;
        return this;
    }

    public ExpenseVTO addImagesUrlsItem(String imagesUrlsItem) {
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

    public ExpenseVTO note(String note) {
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

    public ExpenseVTO createdOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    /**
     * Get createdOn
     *
     * @return createdOn
     */
    @Valid
    @Schema(name = "createdOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdOn")
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public ExpenseVTO createdBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    /**
     * Get createdBy
     *
     * @return createdBy
     */
    @Valid
    @Schema(name = "createdBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdBy")
    public LightUserVTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
    }

    public ExpenseVTO lastModifiedOn(LocalDateTime lastModifiedOn) {
        this.lastModifiedOn = lastModifiedOn;
        return this;
    }

    /**
     * Get lastModifiedOn
     *
     * @return lastModifiedOn
     */
    @Valid
    @Schema(name = "lastModifiedOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastModifiedOn")
    public LocalDateTime getLastModifiedOn() {
        return lastModifiedOn;
    }

    public void setLastModifiedOn(LocalDateTime lastModifiedOn) {
        this.lastModifiedOn = lastModifiedOn;
    }

    public ExpenseVTO lastModifiedBy(LightUserVTO lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
        return this;
    }

    /**
     * Get lastModifiedBy
     *
     * @return lastModifiedBy
     */
    @Valid
    @Schema(name = "lastModifiedBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastModifiedBy")
    public LightUserVTO getLastModifiedBy() {
        return lastModifiedBy;
    }

    public void setLastModifiedBy(LightUserVTO lastModifiedBy) {
        this.lastModifiedBy = lastModifiedBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        ExpenseVTO expenseVTO = (ExpenseVTO) o;
        return Objects.equals(this.id, expenseVTO.id) && Objects.equals(this.expenseDate, expenseVTO.expenseDate)
                && Objects.equals(this.amountExpensed, expenseVTO.amountExpensed)
                && Objects.equals(this.paymentMethod, expenseVTO.paymentMethod)
                && Objects.equals(this.expenseType, expenseVTO.expenseType)
                && Objects.equals(this.imagesUrls, expenseVTO.imagesUrls) && Objects.equals(this.note, expenseVTO.note)
                && Objects.equals(this.createdOn, expenseVTO.createdOn)
                && Objects.equals(this.createdBy, expenseVTO.createdBy)
                && Objects.equals(this.lastModifiedOn, expenseVTO.lastModifiedOn)
                && Objects.equals(this.lastModifiedBy, expenseVTO.lastModifiedBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, expenseDate, amountExpensed, paymentMethod, expenseType, imagesUrls, note, createdOn,
                createdBy, lastModifiedOn, lastModifiedBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class ExpenseVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    expenseDate: ").append(toIndentedString(expenseDate)).append("\n");
        sb.append("    amountExpensed: ").append(toIndentedString(amountExpensed)).append("\n");
        sb.append("    paymentMethod: ").append(toIndentedString(paymentMethod)).append("\n");
        sb.append("    expenseType: ").append(toIndentedString(expenseType)).append("\n");
        sb.append("    imagesUrls: ").append(toIndentedString(imagesUrls)).append("\n");
        sb.append("    note: ").append(toIndentedString(note)).append("\n");
        sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
        sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
        sb.append("    lastModifiedOn: ").append(toIndentedString(lastModifiedOn)).append("\n");
        sb.append("    lastModifiedBy: ").append(toIndentedString(lastModifiedBy)).append("\n");
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
