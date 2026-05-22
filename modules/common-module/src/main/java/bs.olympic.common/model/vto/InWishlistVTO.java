package bs.olympic.common.model.vto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class InWishlistVTO {
    Long destinationId;
    Boolean inWishlist;
}
