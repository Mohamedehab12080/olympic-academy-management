package bs.service.employee.annotation.imports;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportEmployeeCore.Root.class })
public @interface ImportEmployeeCore {

    @ComponentScan(basePackages = {"bs.service.employee.core", "bs.service.employee.controller","bs.service.employee.scheduler"})
    class Root {
    }
}