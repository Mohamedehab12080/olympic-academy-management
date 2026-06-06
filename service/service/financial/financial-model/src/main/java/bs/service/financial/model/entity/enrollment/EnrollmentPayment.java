package bs.service.financial.model.entity.enrollment;

import bs.lib.common.model.enums.PaymentStatus;
import bs.service.enrollment.model.entity.Enrollment;
import bs.service.financial.model.entity.PaymentMethod;
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
@Table(name = "oa_enrollment_payment")
public class EnrollmentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "enrollment_id")
    private Enrollment enrollment;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @Column(name = "payment_date")
    @Basic
    private LocalDate paymentDate;

    @Column(name = "paid_amount")
    @Basic
    private Integer paidAmount;

    @Column(name = "enrollment_value")
    @Basic
    private Integer enrollmentValue;

    @Column(name = "remained_value")
    @Basic
    private Integer remainedValue;

    @Column(name = "image_url")
    @Basic
    private String imageUrl;

    @Column(name = "note")
    @Basic
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus status;

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