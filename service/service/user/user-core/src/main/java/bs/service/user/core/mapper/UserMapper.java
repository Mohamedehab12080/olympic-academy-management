package bs.service.user.core.mapper;

import bs.service.user.model.dto.RegisterUserDTO;
import bs.service.user.model.entity.User;
import bs.service.user.model.generated.LightUserVTO;
import bs.service.user.model.vto.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "password", source = "password", qualifiedByName = "encodePassword")
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdOn", ignore = true)
    @Mapping(target = "lastModifiedOn", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    User toEntity(RegisterUserDTO requestDTO);

    LightUserVTO toLightUserVTO(User user);

    @Mapping(target = "userId" , source = "entity.id")
    @Mapping(target = "token", source = "token")
    @Mapping(target = "expiresIn", source = "expiresIn")
    LoginUserVTO toLoginUserVTO(User entity,Long expiresIn,String token);

    UserDetailsVTO toUserDetailsVTO(User user);

    UserVTO toUserVTO(User user);

    @Mapping(target = "message", constant = "Registration successful")
    RegisterUserVTO toRegisterResponseVTO(User user);

    @Named("encodePassword")
    static String encodePassword(String password) {
        return new BCryptPasswordEncoder().encode(password);
    }

    List<UserVTO> toUserVTOs(List<User> users);

    List<UserDetailsVTO> toUserDetailsVTOs(List<User> user);

}
