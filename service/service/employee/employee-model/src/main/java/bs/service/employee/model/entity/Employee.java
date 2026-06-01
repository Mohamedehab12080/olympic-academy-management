package bs.service.employee.model.entity;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.enums.SalaryTypes;
import bs.service.employee.model.enums.EmployeeTypes;
import bs.service.user.model.entity.User;
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
@Table(name = "oa_employee")
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "full_name")
    @Basic
    private String fullName;

    @Column(name = "national_id")
    @Basic
    private String nationalId;

    @Column(name = "birth_date")
    @Basic
    private LocalDate birthDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "gender")
    private Gender gender;

    @Column(name = "salary")
    @Basic
    private Integer salary;

    @Column(name = "remained_salary")
    @Basic
    private Integer remainedSalary;

    @Enumerated(EnumType.STRING)
    @Column(name = "salary_type")
    private SalaryTypes salaryType;

    @Enumerated(EnumType.STRING)
    @Column(name = "employee_type")
    private EmployeeTypes employeeType;

    @Column(name = "image_url")
    @Basic
    private String imageUrl;

    @Column(name = "hire_date")
    @Basic
    private LocalDate hireDate;

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

    @OneToMany(mappedBy = "employee")
    private List<EmployeeContact> contacts = new ArrayList<>();

}
