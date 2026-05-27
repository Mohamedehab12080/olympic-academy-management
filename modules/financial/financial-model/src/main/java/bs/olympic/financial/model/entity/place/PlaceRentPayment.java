package bs.olympic.financial.model.entity.place;

import bs.olympic.common.model.enums.PaymentStatus;
import bs.olympic.financial.model.entity.PaymentMethod;
import bs.olympic.place.model.entity.Place;
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
@Table(name = "oa_place_rent_payment")
public class PlaceRentPayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToOne
    @JoinColumn(name = "rent_type_id")
    private RentType rentType;


    @Column(name = "rent_amount")
    @Basic
    private Integer rentAmount;

    @Column(name = "payed_amount")
    @Basic
    private Integer payedAmount;

    @Column(name = "remained_amount")
    @Basic
    private Integer remainedAmount;

    @Column(name = "payment_date")
    @Basic
    private LocalDate paymentDate;

    @ManyToOne
    @JoinColumn(name = "payment_method_id")
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
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