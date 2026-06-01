package bs.service.financial.model.entity.salary.deduction;

import bs.service.employee.model.entity.Employee;
import bs.service.financial.model.enums.DeductionTypes;
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
@Table(name = "oa_salary_deduction")
public class SalaryDeduction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "amount_deducted")
    @Basic
    private Integer amountDeducted;

    @Column(name = "image_url")
    @Basic
    private String imageUrl;

    @Column(name = "reason")
    @Basic
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "deduction_type")
    private DeductionTypes deductionType;

    @Column(name = "note")
    @Basic
    private String note;

    @Column(name = "deduction_date")
    @Basic
    private LocalDate deductionDate;

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
