package bs.service.file.model.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fl_file_version")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlFileVersion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "file_id")
    private FlFile file;

    @Column(name = "version")
    @Basic
    private Integer version;

    @Column(name = "fid_version")
    @Basic
    private String fidVersion;

    @Column(name = "size")
    @Basic
    private Long size; // in bytes

    @Column(name = "original_file_name")
    @Basic
    private String originalFilename;

    @Column(name = "server_file_name")
    @Basic
    private String serverFileName;

    @Column(name = "server_location")
    @Basic
    private String serverLocation;

    // Audit fields
    @Column(name = "created_on")
    @Basic
    private LocalDateTime createdOn;

    @Column(name = "created_by_id")
    @Basic
    private Long createdById;

}
