package bs.olympic.financial.model.entity.expense;

import bs.olympic.user.model.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "oa_expense_type")
public class ExpenseType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    @Basic
    private String title;

    @Column(name = "description")
    @Basic
    private String description;

    @Column(name = "is_active")
    @Basic
    private Boolean isActive;

    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;
}