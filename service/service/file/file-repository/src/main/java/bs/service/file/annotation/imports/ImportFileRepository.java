package bs.service.file.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportFileRepository.Root.class})
public @interface ImportFileRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.file.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.file.model.entity"})
    @ComponentScan(basePackages = {"bs.service.file.repository"})
    class Root {
    }
}
