package bs.service.course.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportCourseRepository.Root.class})
public @interface ImportCourseRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.course.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.course.model.entity"})
    @ComponentScan(basePackages = {"bs.service.course.repository"})
    class Root {
    }
}
