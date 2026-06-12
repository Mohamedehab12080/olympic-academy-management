package bs.service.file.model.filter;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.experimental.SuperBuilder;
import bs.lib.sql.db.adapter.model.old.SearchFilter;

import java.time.LocalDateTime;
import java.util.List;

@Data
@SuperBuilder
@AllArgsConstructor
public class FileSearchFilter extends SearchFilter {
    private Integer domainId;
    private String entityId;
    private Boolean isEntityIdIsNull;
    private List<String> fids;
    private LocalDateTime createdOnTo;
}
