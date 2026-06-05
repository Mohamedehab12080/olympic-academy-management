package bs.service.department.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportDepartmentCore.Root.class })
public @interface ImportDepartmentCore {

    @ComponentScan(basePackages = {"bs.service.department.core", "bs.service.department.controller"})
    class Root {
    }
}
