package bs.service.enrollment.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportEnrollmentRepository.Root.class})
public @interface ImportEnrollmentRepository {

    @ComponentScan(basePackages = {"bs.service.enrollment.repository"})
    class Root {
    }
}