package bs.service.user.model.entity;

import bs.service.user.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "oa_user")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name ="id")
    private Integer id;

    @Basic
    @Column(name ="email")
    private String email;

    @Basic
    @Column(name ="password")
    private String password;

    @Basic
    @Column(name = "full_name")
    private String fullName;

    @Basic
    @Column(name = "mobile_number")
    private String mobileNumber;

    @Basic
    @Column(name="role")
    @Enumerated(EnumType.STRING)
    private Role role;

    @Basic
    @Column(name = "is_active")
    private Boolean isActive;

    @Basic
    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Basic
    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "last_modified_by_id")
    private User lastModifiedBy;

    @Basic
    @Column(name = "last_modified_on")
    private LocalDateTime lastModifiedOn;

}
