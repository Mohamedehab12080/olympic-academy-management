package bs.service.financial.model.entity.expense;

import bs.olympic.financial.model.entity.PaymentMethod;
import bs.olympic.user.model.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "oa_expense")
public class Expense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "expense_date")
    @Basic
    private LocalDate expenseDate;

    @Column(name = "amount_expensed")
    @Basic
    private Integer amountExpensed;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @Column(name = "expense_type_id")
    @Basic
    private Integer expenseTypeId;

    @Column(name = "images_urls", columnDefinition = "JSON")
    @Basic
    private String imagesUrls;

    @Column(name = "notes", columnDefinition = "TEXT")
    @Basic
    private String notes;

    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @Column(name = "last_modified_on")
    @Basic
    private LocalDateTime lastModifiedOn;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "last_modified_by_id")
    private User lastModifiedBy;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;
}
