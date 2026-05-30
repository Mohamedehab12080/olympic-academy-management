package bs.service.course.model.entity;

import bs.olympic.course.model.enums.CourseTypes;
import bs.olympic.department.model.entity.Department;
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
@Table(name = "oa_course")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @Column(name = "title")
    @Basic
    private String title;

    @Column(name = "description")
    @Basic
    private String description;

    @Column(name = "duration")
    @Basic
    private Integer duration;

    @Column(name = "max_capacity")
    @Basic
    private Integer maxCapacity;

    @Column(name = "start_date")
    @Basic
    private LocalDate startDate;

    @Column(name = "end_date")
    @Basic
    private LocalDate endDate;

    @Column(name = "image_url")
    @Basic
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "course_type")
    private CourseTypes courseType;

    @Column(name = "price")
    @Basic
    private Integer price;

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
