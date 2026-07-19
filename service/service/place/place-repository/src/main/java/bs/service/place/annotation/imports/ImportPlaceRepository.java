package bs.service.place.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportPlaceRepository.Root.class})
public @interface ImportPlaceRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.place.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.place.model.entity"})
    @ComponentScan(basePackages = {"bs.service.place.repository"})
    class Root {
    }
}