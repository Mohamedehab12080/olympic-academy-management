package bs.olympic.user.model.vto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LightUserVTO {
    private Long id;
    private String fullName;
    private String imageUrl;
}
