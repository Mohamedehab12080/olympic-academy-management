package bs.service.file.model.generated;

import bs.lib.common.model.generated.LookupVTO;
import bs.service.user.model.generated.LightUserVTO;
import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.annotation.Generated;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.*;
import java.util.Objects;
import org.hibernate.validator.constraints.*;
import org.springframework.format.annotation.DateTimeFormat;

/**
 * Represents a file with its metadata and version history
 */
@lombok.Builder
@lombok.AllArgsConstructor
@lombok.NoArgsConstructor

@Schema(name = "FileVTO", description = "Represents a file with its metadata and version history")
@Generated(value = "org.openapitools.codegen.languages.SpringCodegen", comments = "Generator version: 7.6.0")
public class FileVTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;

    private String fid;

    private LookupVTO domain;

    private String extension;

    private Integer lastVersion;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime createdOn;

    private LightUserVTO createdBy;

    public FileVTO id(Long id) {
        this.id = id;
        return this;
    }

    /**
     * Get id
     *
     * @return id
     */

    @Schema(name = "id", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("id")
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public FileVTO fid(String fid) {
        this.fid = fid;
        return this;
    }

    /**
     * 15 or 18-digit unique file identifier (system-generated)
     *
     * @return fid
     */

    @Schema(name = "fid", example = "10012508230001 or 10012508230001001", description = "15 or 18-digit unique file identifier (system-generated)", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("fid")
    public String getFid() {
        return fid;
    }

    public void setFid(String fid) {
        this.fid = fid;
    }

    public FileVTO domain(LookupVTO domain) {
        this.domain = domain;
        return this;
    }

    /**
     * Get domain
     *
     * @return domain
     */
    @Valid
    @Schema(name = "domain", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("domain")
    public LookupVTO getDomain() {
        return domain;
    }

    public void setDomain(LookupVTO domain) {
        this.domain = domain;
    }

    public FileVTO extension(String extension) {
        this.extension = extension;
        return this;
    }

    /**
     * Get extension
     *
     * @return extension
     */

    @Schema(name = "extension", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("extension")
    public String getExtension() {
        return extension;
    }

    public void setExtension(String extension) {
        this.extension = extension;
    }

    public FileVTO lastVersion(Integer lastVersion) {
        this.lastVersion = lastVersion;
        return this;
    }

    /**
     * Get lastVersion
     *
     * @return lastVersion
     */

    @Schema(name = "lastVersion", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("lastVersion")
    public Integer getLastVersion() {
        return lastVersion;
    }

    public void setLastVersion(Integer lastVersion) {
        this.lastVersion = lastVersion;
    }

    public FileVTO createdOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
        return this;
    }

    /**
     * Get createdOn
     *
     * @return createdOn
     */
    @Valid
    @Schema(name = "createdOn", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdOn")
    public LocalDateTime getCreatedOn() {
        return createdOn;
    }

    public void setCreatedOn(LocalDateTime createdOn) {
        this.createdOn = createdOn;
    }

    public FileVTO createdBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
        return this;
    }

    /**
     * Get createdBy
     *
     * @return createdBy
     */
    @Valid
    @Schema(name = "createdBy", requiredMode = Schema.RequiredMode.NOT_REQUIRED)
    @JsonProperty("createdBy")
    public LightUserVTO getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(LightUserVTO createdBy) {
        this.createdBy = createdBy;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        FileVTO fileVTO = (FileVTO) o;
        return Objects.equals(this.id, fileVTO.id) && Objects.equals(this.fid, fileVTO.fid)
                && Objects.equals(this.domain, fileVTO.domain) && Objects.equals(this.extension, fileVTO.extension)
                && Objects.equals(this.lastVersion, fileVTO.lastVersion)
                && Objects.equals(this.createdOn, fileVTO.createdOn)
                && Objects.equals(this.createdBy, fileVTO.createdBy);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, fid, domain, extension, lastVersion, createdOn, createdBy);
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("class FileVTO {\n");
        sb.append("    id: ").append(toIndentedString(id)).append("\n");
        sb.append("    fid: ").append(toIndentedString(fid)).append("\n");
        sb.append("    domain: ").append(toIndentedString(domain)).append("\n");
        sb.append("    extension: ").append(toIndentedString(extension)).append("\n");
        sb.append("    lastVersion: ").append(toIndentedString(lastVersion)).append("\n");
        sb.append("    createdOn: ").append(toIndentedString(createdOn)).append("\n");
        sb.append("    createdBy: ").append(toIndentedString(createdBy)).append("\n");
        sb.append("}");
        return sb.toString();
    }

    /**
     * Convert the given object to string with each line indented by 4 spaces (except the first line).
     */
    private String toIndentedString(Object o) {
        if (o == null) {
            return "null";
        }
        return o.toString().replace("\n", "\n    ");
    }
}
