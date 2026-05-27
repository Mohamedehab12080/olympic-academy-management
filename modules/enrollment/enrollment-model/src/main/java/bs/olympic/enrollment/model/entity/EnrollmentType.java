package bs.olympic.enrollment.model.entity;

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
@Table(name = "oa_enrollment_type")
public class EnrollmentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    @Basic
    private String title;

    @Column(name = "description")
    @Basic
    private String description;

    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @Column(name = "created_by_id")
    @Basic
    private Integer createdBy;

    @Column(name = "is_deleted")
    @Basic
    private Boolean isDeleted;
}