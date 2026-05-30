package bs.service.financial.model.entity;

import bs.service.user.model.entity.User;
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
@Table(name = "oa_payment_method")
public class PaymentMethod {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    @Basic
    private String title;

    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
}
