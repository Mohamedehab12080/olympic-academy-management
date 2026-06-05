package bs.service.enrollment.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportEnrollmentCore.Root.class })
public @interface ImportEnrollmentCore {

    @ComponentScan(basePackages = {"bs.service.enrollment.core", "bs.service.enrollment.controller"})
    class Root {
    }
}