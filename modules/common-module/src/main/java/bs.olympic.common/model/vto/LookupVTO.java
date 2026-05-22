package bs.olympic.common.model.vto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class LookupVTO {
    private Long id;
    private String title;
    private String imageUrl;
}
