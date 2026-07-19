package bs.service.user.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportUserRepository.Root.class})
public @interface ImportUserRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.user.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.user.model.entity"})
    @ComponentScan(basePackages = {"bs.service.user.repository"})
    class Root {
    }
}
