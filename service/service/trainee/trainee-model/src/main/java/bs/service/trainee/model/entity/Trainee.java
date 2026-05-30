package bs.service.trainee.model.entity;

import bs.olympic.common.model.enums.Gender;
import bs.olympic.user.model.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "oa_trainee")
public class Trainee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name")
    @Basic
    private String fullName;

    @Column(name = "national_id")
    @Basic
    private String nationalId;

    @Column(name = "academic_year")
    @Basic
    private String academicYear;

    @Column(name = "birth_date")
    @Basic
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "address")
    @Basic
    private String address;

    @Column(name = "image_url")
    @Basic
    private String imageUrl;

    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @Column(name = "last_modified_on")
    @Basic
    private LocalDateTime lastModifiedOn;

    @Column(name = "created_by_id")
    @Basic
    private User createdBy;

    @Column(name = "last_modified_by_id")
    @Basic
    private User lastModifiedBy;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;

    @OneToMany(mappedBy = "trainee")
    private List<TraineeContact> contacts = new ArrayList<>();

    @OneToMany(mappedBy = "trainee")
    private List<TraineeCertificate> certificates = new ArrayList<>();

    @OneToMany(mappedBy = "trainee")
    private List<HealthCondition> healthConditions = new ArrayList<>();
}
