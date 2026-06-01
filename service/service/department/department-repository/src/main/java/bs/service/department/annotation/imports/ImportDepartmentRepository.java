package bs.service.department.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportDepartmentRepository.Root.class})
public @interface ImportDepartmentRepository {

    @ComponentScan(basePackages = {"bs.service.department.repository"})
    class Root {
    }
}

