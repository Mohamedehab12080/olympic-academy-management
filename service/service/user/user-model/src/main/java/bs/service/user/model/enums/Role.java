package bs.service.user.model.enums;


import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public enum Role {
    ROLE_USER(1,"ROLE_USER"),ROLE_ADMIN(2,"ROLE_ADMIN"),ROLE_SUPER_ADMIN(3,"ROLE_SUPER_ADMIN"),ROLE_TRAINEE(4,"ROLE_TRAINEE");
    private Integer id;
    private String title;
}
