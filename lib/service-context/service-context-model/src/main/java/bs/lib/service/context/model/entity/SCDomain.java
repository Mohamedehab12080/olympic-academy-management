package bs.lib.service.context.model.entity;

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
@Table(name = "sc_domain")
public class SCDomain {
    @Id
    @Column(name = "id")
    private Integer id;

    @Basic
    @Column(name = "title_en")
    private String titleEn;

    @Basic
    @Column(name = "title_ar")
    private String titleAr;

    @Basic
    @Column(name = "event_data_class_name")
    private String eventDataClassName;

    @Basic
    @Column(name = "last_modified_by_id")
    private Long lastModifiedById;

    @Basic
    @Column(name = "last_modified_on")
    private LocalDateTime lastModifiedOn;

}

