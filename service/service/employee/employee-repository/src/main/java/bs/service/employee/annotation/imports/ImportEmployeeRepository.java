package bs.service.employee.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportEmployeeRepository.Root.class})
public @interface ImportEmployeeRepository {

    @ComponentScan(basePackages = {"bs.service.employee.repository"})
    class Root {
    }
}