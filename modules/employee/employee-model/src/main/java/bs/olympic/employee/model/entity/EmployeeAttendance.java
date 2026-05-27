package bs.olympic.employee.model.entity;

import bs.olympic.employee.model.enums.EmployeeAttendanceStatus;
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
@Table(name = "oa_employee_attendance")
public class EmployeeAttendance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @Column(name = "attendance_date")
    @Basic
    private LocalDate attendanceDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private EmployeeAttendanceStatus status;

    @Column(name = "check_in_time")
    @Basic
    private LocalTime checkInTime;

    @Column(name = "check_out_time")
    @Basic
    private LocalTime checkOutTime;

    @Column(name = "late_time")
    @Basic
    private Integer lateTime;

    @Column(name = "note")
    @Basic
    private String note;

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