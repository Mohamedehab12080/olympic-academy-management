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
public class FileVersionSearchFilter extends SearchFilter {
    private List<String> fids;
    private List<Long> fileIds;
    private List<String> fidVersions;
    private LocalDateTime createdOnTo;
}
