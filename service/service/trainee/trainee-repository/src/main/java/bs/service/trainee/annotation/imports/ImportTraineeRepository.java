package bs.service.trainee.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportTraineeRepository.Root.class})
public @interface ImportTraineeRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.trainee.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.trainee.model.entity"})
    @ComponentScan(basePackages = {"bs.service.trainee.repository"})
    class Root {
    }
}
