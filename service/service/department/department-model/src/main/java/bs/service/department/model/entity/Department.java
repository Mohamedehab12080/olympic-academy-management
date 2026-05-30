package bs.service.department.model.entity;

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
@Table(name = "oa_department")
public class Department {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name="title")
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
