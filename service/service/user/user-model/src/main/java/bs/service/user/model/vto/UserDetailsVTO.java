package bs.service.user.model.vto;

import bs.service.user.model.generated.LightUserVTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsVTO {
    private Integer id;
    private String email;
    private String fullName;
    private String mobileNumber;
    private String role;
    private Boolean isActive;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDateTime createdOn;
    private LightUserVTO createdBy;
}
