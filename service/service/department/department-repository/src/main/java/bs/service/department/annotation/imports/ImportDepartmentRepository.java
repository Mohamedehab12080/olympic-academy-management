package bs.service.department.annotation.imports;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportDepartmentRepository.Root.class})
public @interface ImportDepartmentRepository {

    @EnableJpaRepositories(basePackages = {"bs.service.department.repository.jpa"})
    @EntityScan(basePackages = {"bs.service.department.model.entity"})
    @ComponentScan(basePackages = {"bs.service.department.repository"})
    class Root {
    }
}

