package bs.service.user.model.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ActivationVTO {
    private boolean success;
    private String message;
    private String redirectUrl;
}
