package bs.service.trainee.annotation.imports;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Import;

import java.lang.annotation.*;

@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Import(value = {ImportTraineeRepository.Root.class})
public @interface ImportTraineeRepository {

    @ComponentScan(basePackages = {"bs.service.trainee.repository"})
    class Root {
    }
}
