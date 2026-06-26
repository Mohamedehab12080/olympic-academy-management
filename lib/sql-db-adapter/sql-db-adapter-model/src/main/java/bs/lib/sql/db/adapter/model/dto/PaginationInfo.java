package bs.lib.sql.db.adapter.model.dto;

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
        // FIX: This should return true when no pagination is needed
        // The current implementation returns (pageNum == null && pageSize == null)
        // But the builder default sets pageNum=0 and pageSize=25, so this never returns true!
        // You should check the noPagination flag instead
        return noPagination != null && noPagination;
    }

    public static PaginationInfo noPagination() {
        // FIX: Set noPagination to true, not false!
        return PaginationInfo.builder().noPagination(true).build();
    }

    public static PaginationInfo firstItem() {
        return PaginationInfo.builder().pageNum(0).pageSize(1).build();
    }

    public Boolean isApplied() {
        return noPagination;
    }
}