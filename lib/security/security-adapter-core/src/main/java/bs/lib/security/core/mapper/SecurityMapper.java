package bs.lib.security.core.mapper;

import org.mapstruct.Builder;
import org.mapstruct.CollectionMappingStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.MapperConfig;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

@Mapper(componentModel = "spring", builder = @Builder(disableBuilder = true))
@MapperConfig(collectionMappingStrategy = CollectionMappingStrategy.ADDER_PREFERRED)
public abstract class SecurityMapper {
    public UsernamePasswordAuthenticationToken toUser(UserDetails from) {
        return new UsernamePasswordAuthenticationToken(from, null, from.getAuthorities());
    }
}
