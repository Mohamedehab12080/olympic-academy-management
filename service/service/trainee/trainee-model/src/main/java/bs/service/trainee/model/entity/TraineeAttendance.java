package bs.service.trainee.model.entity;

import bs.service.employee.model.entity.CourseSession;
import bs.service.trainee.model.enums.TraineeAttendanceStatus;
import bs.service.user.model.entity.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "oa_trainee_attendance")
public class TraineeAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "trainee_id")
    private Trainee trainee;

    @ManyToOne
    @JoinColumn(name = "course_session_id")
    private CourseSession courseSession;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private TraineeAttendanceStatus status;

    @Column(name = "check_in_time")
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    private LocalTime checkOutTime;

    @Column(name = "late_time")
    private Integer lateTime;

    @Column(name = "note", columnDefinition = "TEXT")
    private String note;

    @Column(name = "attendance_date")
    private LocalDate attendanceDate;

    @Column(name = "created_on")
    private LocalDateTime createdOn;

    @Column(name = "last_modified_on")
    private LocalDateTime lastModifiedOn;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_id")
    private User createdBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "last_modified_by_id")
    private User lastModifiedBy;

    @Column(name = "is_deleted")
    private Boolean isDeleted;
}