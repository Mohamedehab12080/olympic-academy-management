package bs.service.file.model.entity;

import jakarta.persistence.*;
import lombok.*;
import bs.lib.service.context.model.entity.SCDomain;

import java.util.Set;

@Entity
@Table(name = "fl_domain_config")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FlDomainConfig {

    @Id
    @Column(name = "domain_id")
    private Integer domainId;

    @MapsId
    @OneToOne
    @JoinColumn(name = "domain_id", insertable = false, updatable = false)
    private SCDomain domain;

    @Column(name = "base_folder")
    @Basic
    private String baseFolder;

    @Column(name = "label")
    @Basic
    private String label;

    @Column(name = "max_size")
    @Basic
    private Long maxSize; // in bytes

    @Column(name = "allowed_extensions")
    @Basic
    private String allowedExtensions; // comma-separated values (e.g., "pdf,docx,jpg")

    // Helper method to get extensions as Set
    public Set<String> getAllowedExtensionsSet() {
        return Set.of(allowedExtensions.split(","));
    }
}
