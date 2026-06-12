package bs.lib.service.context.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportServiceContextRepository.Root.class})
public @interface ImportServiceContextRepository {

    @EnableJpaRepositories(basePackages = {"bs.lib.service.context.repository.jpa"})
    @EntityScan(basePackages = {"bs.lib.service.context.model.entity"})
    @ComponentScan(basePackages = {"bs.lib.service.context.repository"})
    class Root {
    }
}
