package bs.service.file.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fl_file")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "domain_id")
    private FlDomainConfig domain; // entire domain object for proper ORM mapping

    @Column(name = "extension")
    @Basic
    private String extension;

    // Unique file identifier containing 15 digits for file id and 18 digits for file_id_version
    @Column(name = "fid")
    @Basic
    private String fid;
    
    // Entity identifier that this file is related to, initially null when uploaded
    @Column(name = "entity_id")
    @Basic
    private String entityId;

    @Column(name = "last_version")
    @Basic
    private Integer lastVersion;

    // Audit fields
    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @Column(name = "created_by_id")
    @Basic
    private Long createdById;

    @Column(name = "last_modified_on")
    @Basic
    private LocalDateTime lastModifiedOn;

    @Column(name = "last_modified_by_id")
    @Basic
    private Long lastModifiedById;
}
