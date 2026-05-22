package bs.olympic.common.db.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaginationInfo {
    @Builder.Default
    private Integer pageNum = 0;

    @Builder.Default
    private Integer pageSize = 25;

    @Builder.Default
    private Boolean noPagination = false;

    public Boolean isValidPagination() {
        if (getNoPagination()) {
            return true;
        }
        return pageNum != null && pageSize != null && pageNum >= 0 && pageSize > 0;
    }

    public Boolean getNoPagination() {
        return (pageNum == null && pageSize == null);
    }

    public static PaginationInfo noPagination() {
        return PaginationInfo.builder().noPagination(false).build();
    }

}
