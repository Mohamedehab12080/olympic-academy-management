package bs.service.financial.model.entity.salary.incentive;

import bs.lib.common.model.enums.SalaryTypes;
import bs.service.employee.model.entity.Employee;
import bs.service.financial.model.entity.PaymentMethod;
import bs.service.financial.model.enums.SalaryTransactionType;
import bs.service.user.model.entity.User;
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
@Table(name = "oa_salary_incentive")
public class SalaryIncentive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @Column(name = "withdraw_date")
    @Basic
    private LocalDate withdrawDate;

    @Column(name = "amount_withdrawn")
    @Basic
    private Integer amountWithdrawn;

    @Column(name = "image_url")
    @Basic
    private String imageUrl;

    @Column(name = "salary_type")
    private Integer salaryType;

    @Column(name = "salary_transaction_type")
    private Integer salaryTransactionType;

    @Column(name = "note")
    @Basic
    private String note;

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
