package bs.service.employee.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportEmployeeRepository.Root.class})
public @interface ImportEmployeeRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.employee.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.employee.model.entity"})
    @ComponentScan(basePackages = {"bs.service.employee.repository"})
    class Root {
    }
}