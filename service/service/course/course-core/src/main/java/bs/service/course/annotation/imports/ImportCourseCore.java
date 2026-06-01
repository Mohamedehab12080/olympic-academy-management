package bs.service.course.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportCourseCore.Root.class })
public @interface ImportCourseCore {

    @ComponentScan(basePackages = {"bs.service.course.core", "bs.service.course.controller"})
    class Root {
    }
}
