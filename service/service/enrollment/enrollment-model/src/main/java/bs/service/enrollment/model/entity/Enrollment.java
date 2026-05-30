package bs.service.enrollment.model.entity;

import bs.olympic.common.model.enums.PaymentStatus;
import bs.olympic.course.model.entity.Course;
import bs.olympic.employee.model.entity.Employee;
import bs.olympic.enrollment.model.enums.EnrollmentStatus;
import bs.olympic.trainee.model.entity.Trainee;
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
@Table(name = "oa_enrollment")
public class Enrollment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "trainee_id")
    private Trainee trainee;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne
    @JoinColumn(name = "trainer_id")
    private Employee trainer;

    @ManyToOne
    @JoinColumn(name = "enrollment_type_id")
    private EnrollmentType enrollmentType;

    @Column(name = "start_date")
    @Basic
    private LocalDate startDate;

    @Column(name = "end_date")
    @Basic
    private LocalDate endDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "enrollment_status")
    private EnrollmentStatus enrollmentStatus;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Column(name = "subscription_value")
    @Basic
    private Integer subscriptionValue;

    @Column(name = "discount_amount")
    @Basic
    private Integer discountAmount;

    @Column(name = "discount_percentage")
    @Basic
    private Integer discountPercentage;

    @Column(name = "final_subscription_value")
    @Basic
    private Integer finalSubscriptionValue;

    @Column(name = "remained_subscription_value")
    @Basic
    private Integer remainedSubscriptionValue;

    @Column(name = "note")
    @Basic
    private String note;

    @Column(name = "is_active")
    @Basic
    private Boolean isActive;

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
