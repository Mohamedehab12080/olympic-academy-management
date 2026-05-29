package bs.lib.test.sql.db.adapter.model.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class NonAutoIncTableDTO {
    private Integer id;
    private String titleEn;
    private String titleAr;
    private String code;
}
