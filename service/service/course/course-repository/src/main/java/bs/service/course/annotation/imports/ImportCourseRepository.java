package bs.service.course.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportCourseRepository.Root.class})
public @interface ImportCourseRepository {

    @ComponentScan(basePackages = {"bs.service.course.repository"})
    class Root {
    }
}
