package bs.service.trainee.api.service;

import bs.lib.common.model.enums.Gender;
import bs.lib.common.model.generated.NewRecordVTO;
import bs.lib.sql.db.adapter.model.generated.OrderDirections;
import bs.service.trainee.model.generated.*;

import java.time.LocalDate;

public interface TraineeService {
    NewRecordVTO createTrainee(TraineeDTO traineeDTO);
    NewRecordVTO updateTrainee(Integer traineeId, TraineeDTO traineeDTO);
    void deleteTraineeById(Integer traineeId);
    TraineeVTO getTraineeById(Integer traineeId);
    TraineeResultSet getAllTraineesByFilter(String quickSearch,Boolean isActive, Gender gender, String academicYear,
                                            LocalDate createdOnFrom, LocalDate createdOnTo,
                                            Integer pageNum, Integer pageSize,
                                            OrderDirections orderDir, String orderBy);
}

//These are my service interfaces right now :
//        package bs.service.trainee.api.service;
//
//import bs.lib.common.model.enums.Gender;
//import bs.lib.common.model.generated.NewRecordVTO;
//import bs.lib.sql.db.adapter.model.generated.OrderDirections;
//import bs.service.trainee.model.generated.*;
//
//        import java.time.LocalDate;
//
//public interface TraineeService {
//    NewRecordVTO createTrainee(TraineeDTO traineeDTO);
//    NewRecordVTO updateTrainee(Integer traineeId, TraineeDTO traineeDTO);
//    void deleteTraineeById(Integer traineeId);
//    TraineeVTO getTraineeById(Integer traineeId);
//    TraineeResultSet getAllTraineesByFilter(String quickSearch, Gender gender, String academicYear,
//                                            LocalDate createdOnFrom, LocalDate createdOnTo,
//                                            Integer pageNum, Integer pageSize,
//                                            OrderDirections orderDir, String orderBy);
//}
//
//
//package bs.service.trainee.api.service;
//
//import bs.lib.common.model.generated.NewRecordVTO;
//import bs.service.trainee.model.generated.TraineeContactDTO;
//import bs.service.trainee.model.generated.TraineeContactResultSet;
//
//public interface TraineeContactService {
//
//    NewRecordVTO createTraineeContact(Integer traineeId, TraineeContactDTO traineeContactDTO);
//    NewRecordVTO updateTraineeContact(Integer traineeId, Integer contactId, TraineeContactDTO traineeContactDTO);
//    void deleteTraineeContact(Integer traineeId, Integer contactId);
//    TraineeContactResultSet getTraineeContacts(Integer traineeId);
//}
//
//package bs.service.trainee.api.service;
//
//import bs.lib.common.model.generated.NewRecordVTO;
//import bs.lib.sql.db.adapter.model.generated.OrderDirections;
//import bs.service.trainee.model.generated.TraineeCertificateDTO;
//import bs.service.trainee.model.generated.TraineeCertificateResultSet;
//
//import java.time.LocalDate;
//
//public interface TraineeCertificateService {
//    NewRecordVTO createTraineeCertificate(Integer traineeId, TraineeCertificateDTO traineeCertificateDTO);
//    NewRecordVTO updateTraineeCertificate(Integer traineeId, Integer certificateId, TraineeCertificateDTO traineeCertificateDTO);
//    void deleteTraineeCertificate(Integer traineeId, Integer certificateId);
//    TraineeCertificateResultSet getAllTraineeCertificatesByFilter(Integer traineeId, Integer courseId, String quickSearch, LocalDate issueDateFrom, LocalDate issueDateTo, Integer pageNum, Integer pageSize, OrderDirections orderDir, String orderBy);
//}
//
//package bs.service.trainee.api.service;
//
//import bs.lib.common.model.generated.NewRecordVTO;
//import bs.lib.sql.db.adapter.model.generated.OrderDirections;
//import bs.service.trainee.model.generated.HealthConditionDTO;
//import bs.service.trainee.model.generated.HealthConditionResultSet;
//
//public interface HealthConditionService {
//    NewRecordVTO createHealthCondition(Integer traineeId, HealthConditionDTO healthConditionDTO);
//    NewRecordVTO updateHealthCondition(Integer traineeId, Integer conditionId, HealthConditionDTO healthConditionDTO);
//    void deleteHealthCondition(Integer traineeId, Integer conditionId);
//    HealthConditionResultSet getAllHealthConditionsByFilter(Integer traineeId, String quickSearch, String medication, Integer pageNum, Integer pageSize, OrderDirections orderDir,String orderBy);
//}
//so update swagger and other related accordingly :
//and these are the entities :
//        package bs.service.trainee.model.entity;
//
//import bs.lib.common.model.enums.Gender;
//import bs.service.user.model.entity.User;
//import jakarta.persistence.*;
//        import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.util.ArrayList;
//import java.util.List;
//
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "oa_trainee")
//public class Trainee {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @Column(name = "full_name")
//    @Basic
//    private String fullName;
//
//    @Column(name = "national_id")
//    @Basic
//    private String nationalId;
//
//    @Column(name = "academic_year")
//    @Basic
//    private String academicYear;
//
//    @Column(name = "birth_date")
//    @Basic
//    private LocalDate birthDate;
//
//    
//    @Column(name = "gender")
//    private Gender gender;
//
//    @Column(name = "address")
//    @Basic
//    private String address;
//
//    @Column(name = "image_url")
//    @Basic
//    private String imageUrl;
//
//    @Column(name = "created_on")
//    @Basic
//    private LocalDateTime createdOn;
//
//    @Column(name = "last_modified_on")
//    @Basic
//    private LocalDateTime lastModifiedOn;
//
//    @ManyToOne
//    @JoinColumn(name = "created_by_id")
//    private User createdBy;
//
//    @ManyToOne
//    @JoinColumn(name = "last_modified_by_id")
//    private User lastModifiedBy;
//
//    @Column(name = "is_deleted")
//    @Basic
//    private Boolean isDeleted;
//
//    @OneToMany(mappedBy = "trainee")
//    private List<TraineeContact> contacts = new ArrayList<>();
//
//    @OneToMany(mappedBy = "trainee")
//    private List<TraineeCertificate> certificates = new ArrayList<>();
//
//    @OneToMany(mappedBy = "trainee")
//    private List<HealthCondition> healthConditions = new ArrayList<>();
//}
//
//package bs.service.trainee.model.entity;
//
//import bs.service.user.model.entity.User;
//import jakarta.persistence.*;
//        import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "oa_health_condition")
//public class HealthCondition {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @ManyToOne
//    @JoinColumn(name = "trainee_id")
//    private Trainee trainee;
//
//    @Column(name = "title")
//    @Basic
//    private String title;
//
//    @Column(name = "description")
//    @Basic
//    private String description;
//
//    @Column(name = "medication")
//    @Basic
//    private String medication;
//
//    @Column(name = "note")
//    @Basic
//    private String note;
//
//    @Column(name = "created_on")
//    @Basic
//    private LocalDateTime createdOn;
//
//    @Column(name = "last_modified_on")
//    @Basic
//    private LocalDateTime lastModifiedOn;
//
//    @ManyToOne
//    @JoinColumn(name = "created_by_id")
//    private User createdBy;
//
//    @ManyToOne
//    @JoinColumn(name = "last_modified_by_id")
//    private User lastModifiedBy;
//
//    @Column(name = "is_deleted")
//    @Basic
//    private Boolean isDeleted;
//
//}
//package bs.service.trainee.model.entity;
//
//import bs.service.course.model.entity.Course;
//import bs.service.user.model.entity.User;
//import jakarta.persistence.*;
//        import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "oa_trainee_certificate")
//public class TraineeCertificate {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @Column(name = "certificate_number")
//    @Basic
//    private String certificateNumber;
//
//    @Column(name = "certificate_name")
//    @Basic
//    private String certificateName;
//
//    @ManyToOne
//    @JoinColumn(name = "trainee_id")
//    private Trainee trainee;
//
//    @ManyToOne
//    @JoinColumn(name = "course_id")
//    private Course course;
//
//    @Column(name = "issue_date")
//    @Basic
//    private LocalDate issueDate;
//
//    @Column(name = "grade")
//    @Basic
//    private String grade;
//
//    @Column(name = "created_on")
//    @Basic
//    private LocalDateTime createdOn;
//
//    @Column(name = "last_modified_on")
//    @Basic
//    private LocalDateTime lastModifiedOn;
//
//    @ManyToOne
//    @JoinColumn(name = "created_by_id")
//    private User createdBy;
//
//    @ManyToOne
//    @JoinColumn(name = "last_modified_by_id")
//    private User lastModifiedBy;
//
//    @Column(name = "is_deleted")
//    @Basic
//    private Boolean isDeleted;
//}
//package bs.service.trainee.model.entity;
//
//import bs.lib.common.model.enums.ContactTypes;
//import bs.service.user.model.entity.User;
//import jakarta.persistence.*;
//        import lombok.AllArgsConstructor;
//import lombok.Builder;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import java.time.LocalDateTime;
//
//@Data
//@Builder
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "oa_trainee_contact")
//public class TraineeContact {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//
//    @ManyToOne
//    @JoinColumn(name = "trainee_id")
//    private Trainee trainee;
//
//    
//    @Column(name = "contact_type")
//    private Integer contactType;
//
//    @Column(name = "contact_value")
//    @Basic
//    private String contactValue;
//
//    @Column(name = "created_on")
//    @Basic
//    private LocalDateTime createdOn;
//
//    @Column(name = "last_modified_on")
//    @Basic
//    private LocalDateTime lastModifiedOn;
//
//    @ManyToOne
//    @JoinColumn(name = "created_by_id")
//    private User createdBy;
//
//    @ManyToOne
//    @JoinColumn(name = "last_modified_by_id")
//    private User lastModifiedBy;
//
//    @Column(name = "is_deleted")
//    @Basic
//    private Boolean isDeleted;
//
//}