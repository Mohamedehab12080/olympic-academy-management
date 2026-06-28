package bs.service.place.model.entity;

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
@Table(name = "oa_constant")
public class Constant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "title")
    @Basic
    private String title;

    @Column(name = "value")
    @Basic
    private String value;


    @Column(name = "location")
    @Basic
    private String location;

    @Column(name = "position")
    @Basic
    private String position;

    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @ManyToOne
    @JoinColumn(name = "created_by_id")
    private User createdBy;
}
