package bs.service.enrollment.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportEnrollmentRepository.Root.class})
public @interface ImportEnrollmentRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.enrollment.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.enrollment.model.entity"})
    @ComponentScan(basePackages = {"bs.service.enrollment.repository"})
    class Root {
    }
}